// Path B: the short questionnaire.
//
// Only questions tagged stage = 'declarations' are served. That is the honest
// test for what a stranger may be asked -- it is the same information we would
// have read off an uploaded declarations page, so answering is transcribing
// rather than disclosing something new. Homeowners drops from 46 questions to
// nine that way, and auto from 37 to eleven.
//
// The rest of each set still exists at stage = 'underwriting'. It becomes the
// questionnaire sent once someone is a client and the risk is being marketed,
// which is a different conversation with a different person on the other end.
//
// Answers save on every section advance, so an abandonment halfway through
// leaves something an agent can work from rather than nothing.

import crypto from "node:crypto";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://dtgsegabaivtgyccrcxi.supabase.co";
const UUID_RE = /^[0-9a-f-]{36}$/i;
const SLUG_RE = /^[a-z0-9-]{2,40}$/;

const sbHeaders = (key, extra) => ({
  apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", ...(extra || {}),
});

function requestHost(req) {
  const fwd = req.headers["x-forwarded-host"];
  const host = (Array.isArray(fwd) ? fwd[0] : fwd) || req.headers.host || "";
  return host.split(",")[0].trim().toLowerCase();
}

function isAllowedOrigin(origin, req) {
  if (!origin) return false;
  let originHost;
  try { originHost = new URL(origin).host.toLowerCase(); } catch { return false; }
  if (requestHost(req) && originHost === requestHost(req)) return true;
  return (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim().toLowerCase())
    .filter(Boolean).includes(origin.toLowerCase());
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
const buckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const hits = (buckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  buckets.set(ip, hits);
  if (buckets.size > 5000) buckets.clear();
  return hits.length > RATE_MAX;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

// Answers are free text from a stranger, so they are bounded before storage:
// a jsonb column will happily accept a megabyte of anything.
const MAX_ANSWERS = 60;
const MAX_VALUE_LEN = 2000;

function cleanAnswers(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  let n = 0;
  for (const [k, v] of Object.entries(raw)) {
    if (n >= MAX_ANSWERS) break;
    if (!/^[A-Za-z0-9_]{1,60}$/.test(k)) continue;
    if (v === null || v === undefined || v === "") continue;
    out[k] = typeof v === "string" ? v.slice(0, MAX_VALUE_LEN) : v;
    n++;
  }
  return out;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const originOk = isAllowedOrigin(origin, req);
  if (originOk) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") return res.status(originOk ? 200 : 403).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!originOk) return res.status(403).json({ error: "Forbidden" });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.error("[questionnaire] SUPABASE_SERVICE_ROLE_KEY is not set");
    return res.status(500).json({ error: "Server not configured" });
  }
  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
  }

  const body = req.body || {};
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  if (!SLUG_RE.test(slug)) return res.status(400).json({ error: "Unknown questionnaire." });

  // ---- questions ----------------------------------------------------------
  if (body.action === "questions") {
    const tRes = await fetch(
      `${SUPABASE_URL}/rest/v1/questionnaire_types?slug=eq.${encodeURIComponent(slug)}&active=is.true&select=id,slug,title,intro_text&limit=1`,
      { headers: sbHeaders(serviceKey) }
    );
    if (!tRes.ok) return res.status(502).json({ error: "Could not load the questions." });
    let types = null;
    try { types = JSON.parse(await tRes.text()); } catch { types = null; }
    const type = Array.isArray(types) ? types[0] : null;
    if (!type) return res.status(404).json({ error: "Unknown questionnaire." });

    const qRes = await fetch(
      `${SUPABASE_URL}/rest/v1/questionnaire_questions` +
      `?questionnaire_type_id=eq.${type.id}&stage=eq.declarations` +
      `&select=id,section,sort_order,field_key,label,field_type,options,required,help_text` +
      `&order=sort_order.asc`,
      { headers: sbHeaders(serviceKey) }
    );
    if (!qRes.ok) return res.status(502).json({ error: "Could not load the questions." });
    let questions = [];
    try { questions = JSON.parse(await qRes.text()) || []; } catch { questions = []; }

    return res.status(200).json({
      slug: type.slug,
      title: type.title,
      intro: type.intro_text,
      questions,
    });
  }

  // ---- save ---------------------------------------------------------------
  // Called on every section advance, not only at the end. A questionnaire
  // abandoned halfway should leave an agent something to work from; the
  // alternative is that two minutes of a real person's effort evaporates
  // because they closed a tab.
  if (body.action === "save") {
    const answers = cleanAnswers(body.answers);
    const complete = body.complete === true;
    const leadId = UUID_RE.test(String(body.lead_id || "")) ? body.lead_id : null;
    const submissionId = UUID_RE.test(String(body.submission_id || "")) ? body.submission_id : null;

    const tRes = await fetch(
      `${SUPABASE_URL}/rest/v1/questionnaire_types?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
      { headers: sbHeaders(serviceKey) }
    );
    if (!tRes.ok) return res.status(502).json({ error: "Could not save your answers." });
    let types = null;
    try { types = JSON.parse(await tRes.text()); } catch { types = null; }
    const typeId = Array.isArray(types) ? types[0]?.id : null;
    if (!typeId) return res.status(404).json({ error: "Unknown questionnaire." });

    let id = submissionId;
    if (id) {
      const upd = await fetch(`${SUPABASE_URL}/rest/v1/questionnaire_submissions?id=eq.${id}`, {
        method: "PATCH",
        headers: sbHeaders(serviceKey),
        body: JSON.stringify({ answers, status: complete ? "submitted" : "partial" }),
      });
      if (!upd.ok) return res.status(502).json({ error: "Could not save your answers." });
    } else {
      const ins = await fetch(`${SUPABASE_URL}/rest/v1/questionnaire_submissions`, {
        method: "POST",
        headers: sbHeaders(serviceKey, { Prefer: "return=representation" }),
        body: JSON.stringify({
          questionnaire_type_id: typeId,
          answers,
          status: complete ? "submitted" : "partial",
        }),
      });
      if (!ins.ok) {
        const t = await ins.text();
        console.error(`[questionnaire] insert failed ${ins.status}: ${t.slice(0, 200)}`);
        return res.status(502).json({ error: "Could not save your answers." });
      }
      let rows = null;
      try { rows = JSON.parse(await ins.text()); } catch { rows = null; }
      id = (Array.isArray(rows) ? rows[0] : rows)?.id || null;

      // Link it to the lead the moment it exists, so a half-finished
      // questionnaire is findable from the lead rather than orphaned.
      if (id && leadId) {
        await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}`, {
          method: "PATCH", headers: sbHeaders(serviceKey),
          body: JSON.stringify({ submission_id: id }),
        }).catch(() => {});
        await fetch(`${SUPABASE_URL}/rest/v1/lead_events`, {
          method: "POST", headers: sbHeaders(serviceKey),
          body: JSON.stringify({ lead_id: leadId, event: "STEP2_STARTED", meta: { slug, submission_id: id } }),
        }).catch(() => {});
      }
    }

    if (complete && leadId) {
      await fetch(`${SUPABASE_URL}/rest/v1/lead_events`, {
        method: "POST", headers: sbHeaders(serviceKey),
        body: JSON.stringify({ lead_id: leadId, event: "QUESTIONNAIRE_COMPLETED", meta: { slug, submission_id: id } }),
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true, submission_id: id });
  }

  return res.status(400).json({ error: "Unknown action" });
}
