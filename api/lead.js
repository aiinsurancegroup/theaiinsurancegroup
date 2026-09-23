// Step 1 of the lead form: create a lead, and create it immediately.
//
// The whole point of splitting the questionnaire in two is that this runs
// before the long questions. A visitor who abandons at question 12 of 46 has
// still produced a usable lead, because the lead was written the moment they
// finished six fields. Everything after this is enrichment.
//
// WHY THE BROWSER NEVER TOUCHES THE DATABASE
// leads and lead_events carry no grant for anon or authenticated (migration 09)
// and no RLS policy. Writes reach them only through this route, holding the
// service key. An anon insert-only policy was considered and rejected: it still
// puts a public key in the browser, and while it would stop reading, it would
// not stop anyone posting fabricated leads carrying whatever UTM values they
// chose -- which poisons the one thing this table exists to measure.
//
// Required environment variables (both confirmed set on this project):
//   SUPABASE_SERVICE_ROLE_KEY
//   VITE_SUPABASE_URL

import crypto from "node:crypto";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://dtgsegabaivtgyccrcxi.supabase.co";

// States we are licensed in. A lead outside these is still captured and still
// answered -- it is flagged for the operator to decide case by case, because a
// referral or a licence worth adding cannot be decided about someone who was
// turned away before they told us who they were.
const LICENSED_STATES = new Set(["NJ", "PA", "FL"]);

// The authoritative consent wording, stored verbatim on the lead. Never taken
// from the request: what we record has to be what was on the screen, and the
// browser is not the authority on that. Same rule as CONSENT_TEXT in the audit
// tool's client portal.
const TCPA_CONSENT_TEXT =
  "By providing my mobile number and checking this box, I agree that The AI Insurance Group may contact me at that number about my insurance review by phone call, text message, or automated or prerecorded means, including at a number I was assigned by a wireless carrier. Consent is not a condition of purchase. Message and data rates may apply. I can opt out at any time by replying STOP.";

const DOCS_CONSENT_TEXT =
  "I authorize The AI Insurance Group to review the insurance documents I upload, for the purpose of identifying coverage gaps, exclusions and other features of my insurance program. I understand my documents are stored securely, are never sold, and are shared only with the service providers used to carry out this review.";

// ZIP prefix ranges to state. Complete for the fifty states, DC and PR, so a
// lead is always tagged even when we cannot act on it -- an untagged lead
// cannot be triaged, and triage is the entire plan for out-of-area leads.
const ZIP_RANGES = [
  [[5, 5], "NY"], [[6, 9], "PR"], [[10, 27], "MA"], [[28, 29], "RI"],
  [[30, 38], "NH"], [[39, 49], "ME"], [[50, 59], "VT"], [[60, 69], "CT"],
  [[70, 89], "NJ"], [[100, 149], "NY"], [[150, 196], "PA"], [[197, 199], "DE"],
  [[200, 200], "DC"], [[201, 201], "VA"], [[202, 205], "DC"], [[206, 219], "MD"],
  [[220, 246], "VA"], [[247, 268], "WV"], [[270, 289], "NC"], [[290, 299], "SC"],
  [[300, 319], "GA"], [[320, 349], "FL"], [[350, 369], "AL"], [[370, 385], "TN"],
  [[386, 397], "MS"], [[398, 399], "GA"], [[400, 427], "KY"], [[430, 459], "OH"],
  [[460, 479], "IN"], [[480, 499], "MI"], [[500, 528], "IA"], [[530, 549], "WI"],
  [[550, 567], "MN"], [[570, 577], "SD"], [[580, 588], "ND"], [[590, 599], "MT"],
  [[600, 629], "IL"], [[630, 658], "MO"], [[660, 679], "KS"], [[680, 693], "NE"],
  [[700, 714], "LA"], [[716, 729], "AR"],
  // 733 is Austin, Texas -- an IRS prefix sitting inside Oklahoma's block.
  // Ranges are checked in order, so the narrower one has to come first.
  [[730, 732], "OK"], [[733, 733], "TX"], [[734, 749], "OK"],
  [[750, 799], "TX"],
  [[800, 816], "CO"], [[820, 831], "WY"], [[832, 838], "ID"], [[840, 847], "UT"],
  [[850, 865], "AZ"], [[870, 884], "NM"], [[885, 885], "TX"], [[889, 898], "NV"],
  [[900, 961], "CA"], [[967, 968], "HI"], [[970, 979], "OR"], [[980, 994], "WA"],
  [[995, 999], "AK"],
];

export function stateFromZip(zip) {
  if (typeof zip !== "string") return null;
  const digits = zip.trim().slice(0, 5);
  if (!/^\d{5}$/.test(digits)) return null;
  const prefix = parseInt(digits.slice(0, 3), 10);
  for (const [[lo, hi], st] of ZIP_RANGES) if (prefix >= lo && prefix <= hi) return st;
  return null;
}

// What a visitor asked about -> which questionnaire, given their state.
// auto-nj is New Jersey-specific: there is no Pennsylvania or Florida auto
// questionnaire yet, so a PA auto lead is licensed but unroutable. It is
// captured with a null slug and picked up by hand, which is honest -- routing
// a Pennsylvanian into a form full of New Jersey coverage questions would be
// worse than routing them nowhere.
const PRODUCT_ROUTES = {
  home:      { slug: () => "homeowners",        states: null },
  auto:      { slug: (st) => (st === "NJ" ? "auto-nj" : null), states: null },
  umbrella:  { slug: () => "personal-umbrella",  states: null },
  business:  { slug: () => "general-liability",  states: null },
  workers:   { slug: () => "workers-comp",       states: null },
};

export function routeFor(product, state) {
  const licensed = LICENSED_STATES.has(state || "");
  if (!licensed) return { in_licensed_state: false, questionnaire_slug: null };
  const route = PRODUCT_ROUTES[product];
  return { in_licensed_state: true, questionnaire_slug: route ? route.slug(state) : null };
}

// --- validation -------------------------------------------------------------
// Shape only. Nothing here rejects a real person for a formatting quirk: a lead
// we cannot read is worth more than no lead, so the rules are the minimum that
// make a record usable.

const clean = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validate(body) {
  const first = clean(body.first_name, 80);
  const last = clean(body.last_name, 80);
  const email = clean(body.email, 254).toLowerCase();
  const zip = clean(body.zip, 10);
  // Keep the digits; people type (732) 555-0100 and that is fine.
  const phoneDigits = String(body.mobile_phone || "").replace(/\D/g, "");

  if (!first) return { error: "Please enter your first name." };
  if (!last) return { error: "Please enter your last name." };
  if (!EMAIL_RE.test(email)) return { error: "Please check your email address." };
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return { error: "Please enter a mobile number we can reach you on." };
  }
  if (!/^\d{5}(-\d{4})?$/.test(zip)) return { error: "Please enter a 5-digit ZIP code." };
  if (body.tcpa_consent !== true) {
    return { error: "Please agree to be contacted so we can send you the review." };
  }

  return { first, last, email, zip, phone: phoneDigits };
}

// --- attribution ------------------------------------------------------------
// The utm_* values and gclid come from the query string, so they are whatever
// the visitor's URL said -- they are labels, not claims, and a fabricated one
// only misattributes a lead the fabricator created. The IP and user agent are
// read from the request instead, because those go into a consent record and a
// consent record built from self-reported values is worth nothing.

const attr = (v) => (typeof v === "string" ? v.trim().slice(0, 300) : null) || null;

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || null;
}

function deviceType(ua) {
  if (typeof ua !== "string") return null;
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

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
  const extra = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return extra.includes(origin.toLowerCase());
}

// Per-warm-instance damper. Vercel runs many instances so this is a speed bump
// rather than a rate limit, but it raises the cost of scripting junk leads into
// the table from free to slightly annoying.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 12;
const buckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const hits = (buckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  buckets.set(ip, hits);
  if (buckets.size > 5000) buckets.clear();
  return hits.length > RATE_MAX;
}

const sbHeaders = (key, extra) => ({
  apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", ...(extra || {}),
});

// --- the upload path --------------------------------------------------------
//
// Path A: they upload a policy, and that is the whole of Step 1. The
// declarations page carries everything the questionnaire would have asked, so
// asking anyway is asking someone to transcribe a document they just handed us.
//
// The file has to end up somewhere the audit tool can actually analyse, which
// means a real audit row and a real audit_policies row -- not a recorded
// intention. A lead that says "they meant to upload something" costs the client
// a second request for the same document, which is the thing this path exists
// to avoid.
//
// Same route the client portal uses: the server mints a signed URL and owns the
// path, the browser PUTs the bytes straight to storage. They never pass through
// a function, which is what keeps this clear of the 4.5MB request body cap.

const BUCKET = "policies";
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const UUID_RE = /^[0-9a-f-]{36}$/i;

// What a visitor said they wanted -> the audit tool's policy_type. "detect" is
// its auto-identify sentinel, and it is the right default: someone uploading
// from a homeowners landing page may well attach their auto policy instead, and
// the analysis identifies the document rather than trusting the button.
const PRODUCT_POLICY_TYPE = {
  home: "property", auto: "auto_policy", umbrella: "umbrella",
  business: "gl", workers: "wc",
};

// A lead who did not upload gets a secure link, unasked. Most people fill this
// in on a phone while their policy is in a filing cabinet or a different inbox,
// so the upload button is the wrong question at that moment -- the link lets
// them answer it later, from wherever the document actually is.
//
// The token is the audit tool's own portal credential: 32 crypto bytes, 90-day
// expiry, matching api/admin/audit.js. Anything weaker would be a bearer
// credential in an inbox generated by a predictable PRNG.
const TOKEN_TTL_DAYS = 90;
const PORTAL_ORIGIN = "https://audit.theaiinsurancegroup.com";

async function emailUploadLink(lead, auditId, serviceKey) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + TOKEN_TTL_DAYS * 86400000);

  const patch = await fetch(`${SUPABASE_URL}/rest/v1/audits?id=eq.${auditId}`, {
    method: "PATCH",
    headers: sbHeaders(serviceKey),
    body: JSON.stringify({
      client_token: token,
      client_token_issued_at: now.toISOString(),
      client_token_expires_at: expires.toISOString(),
    }),
  });
  if (!patch.ok) {
    console.error(`[lead] could not attach a token to audit ${auditId}: ${patch.status}`);
    return false;
  }

  // TEMPORARY DIAGNOSTIC -- remove once the key is confirmed. Logs NAMES and
  // LENGTHS only, never a value, so it can distinguish "absent" from "present
  // under a different name" without putting a secret in a log line.
  console.log("[lead] env probe: mail-ish keys = " +
    JSON.stringify(Object.keys(process.env).filter((k) => /RESEND|MAIL|SMTP/i.test(k))) +
    ", RESEND_API_KEY length = " + (process.env.RESEND_API_KEY || "").length +
    ", VERCEL_ENV = " + process.env.VERCEL_ENV);
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // The link exists and works; only the delivery is missing. Logged loudly
    // because from the outside this looks like a lead that was simply never
    // followed up, and the operator can still send the link by hand.
    console.error(`[lead] RESEND_API_KEY not set -- upload link for audit ${auditId} was NOT emailed`);
    return false;
  }

  const link = `${PORTAL_ORIGIN}?token=${token}`;
  const name = escapeHtml(lead.first_name || "there");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: "The AI Insurance Group <sal@theaiinsurancegroup.com>",
      to: [lead.email],
      reply_to: "sal@theaiinsurancegroup.com",
      subject: "Your secure link to send us your policy",
      html:
        `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.65;color:#2C3949;max-width:520px">` +
        `<p>Hi ${name},</p>` +
        `<p>Thanks for asking for a free insurance review. When your current policy is handy, send it across here:</p>` +
        `<p><a href="${link}">Send my policy securely</a></p>` +
        `<p>A photo of your declarations page is usually enough. The link is yours alone, so please don't forward it, and it stays active for ${TOKEN_TTL_DAYS} days.</p>` +
        `<p>If you would rather just talk it through, reply to this email and we'll call you.</p>` +
        `<p style="margin-top:22px">&mdash; The AI Insurance Group</p>` +
        `</div>`,
    }),
  });
  if (!r.ok) {
    console.error(`[lead] upload-link email failed: ${r.status}`);
    return false;
  }
  return true;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function safeFileName(name) {
  const base = String(name || "").split(/[\\/]/).pop() || "policy.pdf";
  const cleaned = base.replace(/[^A-Za-z0-9._-]/g, "_").replace(/^\.+/, "").slice(0, 120);
  return cleaned || "policy.pdf";
}

const randomSegment = () => Math.random().toString(36).slice(2, 11);

// Create the audit this lead's documents will live in, and mint one signed
// upload URL. client_industry is NOT NULL on audits and a personal-lines lead
// has no industry, so it is set explicitly rather than left to fail the insert.
async function createAuditForLead(lead, serviceKey, fileName, fileSize) {
  const clientName = `${lead.first_name} ${lead.last_name}`.trim();
  const ins = await fetch(`${SUPABASE_URL}/rest/v1/audits`, {
    method: "POST",
    headers: sbHeaders(serviceKey, { Prefer: "return=representation" }),
    body: JSON.stringify({
      client_name: clientName,
      client_industry: lead.product === "business" || lead.product === "workers" ? "Other" : "Personal Lines",
      client_contact: clientName,
      client_email: lead.email,
      status: "DRAFT",
      file_count: 0,
      created_by: "web",
    }),
  });
  const text = await ins.text();
  if (!ins.ok) {
    console.error(`[lead] audit insert failed ${ins.status}: ${text.slice(0, 200)}`);
    return null;
  }
  let rows = null;
  try { rows = JSON.parse(text); } catch { rows = null; }
  const audit = Array.isArray(rows) ? rows[0] : rows;
  if (!audit?.id) return null;

  // No file means no signed URL. This function is also called for the
  // email-a-link path, where the audit is wanted but nothing is being uploaded
  // right now, and minting a signed URL nobody will ever PUT to is a wasted
  // round trip to storage on every single lead.
  if (!fileName) return { audit_id: audit.id, upload: null };

  const path = `${audit.id}/${randomSegment()}_${safeFileName(fileName)}`;
  const signRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${path}`,
    { method: "POST", headers: sbHeaders(serviceKey), body: JSON.stringify({}) }
  );
  if (!signRes.ok) {
    console.error(`[lead] sign upload failed ${signRes.status}`);
    return { audit_id: audit.id, upload: null };
  }
  let signed = null;
  try { signed = JSON.parse(await signRes.text()); } catch { signed = null; }
  const token = signed?.url ? new URLSearchParams(signed.url.split("?")[1] || "").get("token") : null;
  if (!token) return { audit_id: audit.id, upload: null };

  // The whole URL is returned, not its parts. This site carries no Supabase
  // client library -- only React -- so the browser does a plain PUT, and
  // assembling the URL there would mean hard-coding the storage host in the
  // bundle and keeping it in step with this file by hand.
  return {
    audit_id: audit.id,
    upload: { path, signed_url: `${SUPABASE_URL}/storage/v1${signed.url}` },
  };
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
    console.error("[lead] SUPABASE_SERVICE_ROLE_KEY is not set");
    return res.status(500).json({ error: "Server not configured" });
  }

  const ip = clientIp(req);
  if (rateLimited(ip || "unknown")) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
  }

  const body = req.body || {};

  // ---- attach --------------------------------------------------------------
  // Called after the browser has PUT the bytes to storage. Records the document
  // against the audit so it appears in the admin dashboard ready to analyse.
  //
  // The path is NOT trusted. A caller holding a lead id could otherwise attach
  // any object in the bucket to their own lead, so the path must sit inside the
  // folder of the audit already linked to that lead -- which the server created
  // and the caller never chose.
  if (body.action === "attach") {
    if (!UUID_RE.test(String(body.lead_id || ""))) return res.status(400).json({ error: "Invalid request." });

    const look = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?id=eq.${body.lead_id}&select=id,audit_id,product,first_name,last_name`,
      { headers: sbHeaders(serviceKey) }
    );
    if (!look.ok) return res.status(502).json({ error: "Could not attach the document." });
    let lrows = null;
    try { lrows = JSON.parse(await look.text()); } catch { lrows = null; }
    const lead = Array.isArray(lrows) ? lrows[0] : null;
    if (!lead?.audit_id) return res.status(400).json({ error: "Invalid request." });

    const path = String(body.path || "");
    const prefix = `${lead.audit_id}/`;
    if (!path.startsWith(prefix) || path.includes("..") || !/^[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,200}$/.test(path)) {
      console.error(`[lead] attach rejected a path outside its own audit: ${path.slice(0, 80)}`);
      return res.status(400).json({ error: "Invalid request." });
    }

    const size = Number(body.file_size_bytes);
    const polIns = await fetch(`${SUPABASE_URL}/rest/v1/audit_policies`, {
      method: "POST",
      headers: sbHeaders(serviceKey),
      body: JSON.stringify({
        audit_id: lead.audit_id,
        policy_type: PRODUCT_POLICY_TYPE[lead.product] || "detect",
        file_name: safeFileName(body.file_name),
        file_size_bytes: Number.isFinite(size) && size > 0 ? size : null,
        storage_path: path,
        ai_status: "PENDING",
        validation_status: "PENDING",
      }),
    });
    if (!polIns.ok) {
      const t = await polIns.text();
      console.error(`[lead] audit_policies insert failed ${polIns.status}: ${t.slice(0, 200)}`);
      return res.status(502).json({ error: "Could not attach the document." });
    }

    await fetch(`${SUPABASE_URL}/rest/v1/audits?id=eq.${lead.audit_id}`, {
      method: "PATCH", headers: sbHeaders(serviceKey), body: JSON.stringify({ file_count: 1 }),
    }).catch(() => {});

    await fetch(`${SUPABASE_URL}/rest/v1/lead_events`, {
      method: "POST", headers: sbHeaders(serviceKey),
      body: JSON.stringify({ lead_id: lead.id, event: "POLICY_UPLOADED", meta: { audit_id: lead.audit_id } }),
    }).catch(() => {});

    return res.status(200).json({ ok: true });
  }

  const v = validate(body);
  if (v.error) return res.status(400).json({ error: v.error });

  const state = stateFromZip(v.zip);
  const product = clean(body.product, 40).toLowerCase() || null;
  const route = routeFor(product, state);

  const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"].slice(0, 500) : null;
  const now = new Date().toISOString();

  const payload = {
    first_name: v.first, last_name: v.last, email: v.email,
    mobile_phone: v.phone, zip: v.zip,
    state,
    in_licensed_state: route.in_licensed_state,
    product,
    questionnaire_slug: route.questionnaire_slug,

    utm_source: attr(body.utm_source), utm_medium: attr(body.utm_medium),
    utm_campaign: attr(body.utm_campaign), utm_term: attr(body.utm_term),
    utm_content: attr(body.utm_content), gclid: attr(body.gclid),
    landing_path: attr(body.landing_path), referrer: attr(body.referrer),
    device_type: deviceType(userAgent),

    tcpa_consent_text: TCPA_CONSENT_TEXT,
    tcpa_consent_at: now,
    tcpa_consent_ip: ip,
    tcpa_consent_user_agent: userAgent,
  };

  // The documents consent is separate and only recorded if they actually
  // agreed to it -- it is optional at Step 1, because it only matters if they
  // upload something. Merging it into the TCPA checkbox would mean one tick
  // standing for two different permissions, which is exactly what a regulator
  // reads apart.
  if (body.docs_consent === true) {
    payload.docs_consent_text = DOCS_CONSENT_TEXT;
    payload.docs_consent_at = now;
    payload.docs_consent_ip = ip;
  }

  const ins = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    headers: sbHeaders(serviceKey, { Prefer: "return=representation" }),
    body: JSON.stringify(payload),
  });
  const text = await ins.text();
  if (!ins.ok) {
    console.error(`[lead] insert failed ${ins.status}: ${text.slice(0, 300)}`);
    return res.status(502).json({ error: "We could not save your details. Please try again." });
  }
  let rows = null;
  try { rows = JSON.parse(text); } catch { rows = null; }
  const lead = Array.isArray(rows) ? rows[0] : rows;
  if (!lead?.id) {
    console.error("[lead] insert returned no row");
    return res.status(502).json({ error: "We could not save your details. Please try again." });
  }

  // Non-blocking. The lead is the thing that matters and it already exists; a
  // lost event line must never turn into a lost lead.
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/lead_events`, {
      method: "POST",
      headers: sbHeaders(serviceKey),
      body: JSON.stringify({
        lead_id: lead.id,
        event: "LEAD_CREATED",
        meta: { product, state, in_licensed_state: route.in_licensed_state, slug: route.questionnaire_slug },
      }),
    });
  } catch (e) {
    console.error(`[lead] event write failed for ${lead.id}: ${e.message}`);
  }

  // Path A: they are uploading. Create the audit and hand back a signed URL so
  // the browser can PUT the file straight to storage. Done here rather than in
  // a second round trip because the audit belongs to this lead either way, and
  // a lead that exists without its audit is a lead someone has to chase.
  let upload = null;
  if (body.will_upload === true && body.docs_consent === true) {
    const size = Number(body.file_size_bytes);
    if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_BYTES) {
      // The lead is already saved. Say so rather than failing the whole step --
      // losing a lead over an oversized attachment would be the worse trade.
      upload = { error: `That file is over ${Math.round(MAX_FILE_BYTES / 1048576)} MB. We'll email you about it instead.` };
    } else {
      const created = await createAuditForLead(lead, serviceKey, body.file_name, size);
      if (created?.audit_id) {
        await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${lead.id}`, {
          method: "PATCH", headers: sbHeaders(serviceKey),
          body: JSON.stringify({ audit_id: created.audit_id }),
        }).catch(() => {});
        upload = created.upload
          ? { audit_id: created.audit_id, ...created.upload }
          : { error: "We couldn't prepare the upload. We'll email you instead." };
      } else {
        upload = { error: "We couldn't prepare the upload. We'll email you instead." };
      }
    }
  }

  // Everyone who did not end up with a file attached gets a secure link. That
  // covers the visitor who never picked one and the visitor whose upload could
  // not be prepared -- both are someone who still has a policy to send us, and
  // neither should have to come back and find the form again.
  //
  // The audit is created here if Path A did not already make one, so the link
  // has somewhere to deliver into. Failures are logged and swallowed: the lead
  // is saved, and a missing email is a follow-up the operator can make by hand
  // rather than a reason to fail a submission that otherwise worked.
  if (!upload?.path) {
    try {
      let auditId = upload?.audit_id || null;
      if (!auditId) {
        const created = await createAuditForLead(lead, serviceKey, null, 0);
        auditId = created?.audit_id || null;
        if (auditId) {
          await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${lead.id}`, {
            method: "PATCH", headers: sbHeaders(serviceKey),
            body: JSON.stringify({ audit_id: auditId }),
          }).catch(() => {});
        }
      }
      if (auditId && (await emailUploadLink(lead, auditId, serviceKey))) {
        await fetch(`${SUPABASE_URL}/rest/v1/lead_events`, {
          method: "POST", headers: sbHeaders(serviceKey),
          body: JSON.stringify({ lead_id: lead.id, event: "UPLOAD_LINK_SENT", meta: { audit_id: auditId } }),
        }).catch(() => {});
      }
    } catch (e) {
      console.error(`[lead] upload-link step failed for ${lead.id}: ${e.message}`);
    }
  }

  // The client gets the id, where to go next, and an upload slot if they asked
  // for one. Nothing else about the row -- notably not whether we are licensed
  // in their state as a bare fact, because the UI needs the routing decision
  // rather than a verdict to display.
  return res.status(200).json({
    lead_id: lead.id,
    // Path A ends here: the declarations page carries what the questionnaire
    // would have asked, so there is nothing left to ask.
    next: upload?.path ? "uploaded" : route.questionnaire_slug ? "questionnaire" : "manual",
    questionnaire_slug: route.questionnaire_slug,
    upload,
  });
}
