// Vercel serverless function.
// All blog_posts writes go through here. The client never talks directly to
// Supabase for inserts/updates/deletes anymore. This lets us:
//   1. Keep the secret service_role_key on the server, never in the browser bundle.
//   2. Gate every write on an admin password stored in a Vercel env var.
//
// Required Vercel environment variables:
//   ADMIN_PASSWORD              - the admin password (anything you want)
//   SUPABASE_SERVICE_ROLE_KEY   - service role key from Supabase dashboard
//
// Actions supported via JSON body:
//   { action: "verify" }                     -> { ok: true } if password correct
//   { action: "create", payload: {...} }     -> inserts a new blog post
//   { action: "update", id, payload: {...} } -> updates a blog post by id
//   { action: "delete", id }                 -> deletes a blog post by id
//
// Every request must include the "x-admin-password" header.

const SUPABASE_URL = "https://dtgsegabaivtgyccrcxi.supabase.co";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const providedPassword = req.headers["x-admin-password"];
  const adminPassword = process.env.ADMIN_PASSWORD;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!adminPassword || !serviceKey) {
    return res.status(500).json({ error: "Server not configured" });
  }
  if (!providedPassword || providedPassword !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = req.body || {};
  const action = body.action;

  if (action === "verify") {
    return res.status(200).json({ ok: true });
  }

  const sbHeaders = {
    apikey: serviceKey,
    Authorization: "Bearer " + serviceKey,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  try {
    if (action === "create") {
      if (!body.payload) return res.status(400).json({ error: "Missing payload" });
      const r = await fetch(SUPABASE_URL + "/rest/v1/blog_posts", {
        method: "POST",
        headers: sbHeaders,
        body: JSON.stringify(body.payload),
      });
      const data = await r.text();
      return res.status(r.status).send(data);
    }

    if (action === "update") {
      if (!body.id || !body.payload) return res.status(400).json({ error: "Missing id or payload" });
      const { id: _ignored, ...clean } = body.payload;
      const r = await fetch(SUPABASE_URL + "/rest/v1/blog_posts?id=eq." + encodeURIComponent(body.id), {
        method: "PATCH",
        headers: sbHeaders,
        body: JSON.stringify(clean),
      });
      const data = await r.text();
      return res.status(r.status).send(data);
    }

    if (action === "delete") {
      if (!body.id) return res.status(400).json({ error: "Missing id" });
      const r = await fetch(SUPABASE_URL + "/rest/v1/blog_posts?id=eq." + encodeURIComponent(body.id), {
        method: "DELETE",
        headers: sbHeaders,
      });
      const data = await r.text();
      return res.status(r.status).send(data || "{}");
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: "Upstream request failed", detail: String(e) });
  }
}
