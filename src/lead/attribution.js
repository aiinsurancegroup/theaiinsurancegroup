// First-touch attribution.
//
// The question this exists to answer is which ads produce customers, not which
// produce form fills. That means the campaign that brought someone here has to
// survive them reading three pages and converting twenty minutes later -- so it
// is captured on arrival and read back at submit, rather than scraped from the
// URL of whatever page the form happens to sit on.
//
// FIRST touch, not last: once a visitor is tagged they keep that tag. Someone
// who arrives on a paid click, leaves, and returns by typing the domain should
// still be credited to the ad that found them, or paid search looks worse than
// it is and organic looks better.

const KEY = "aiig_attr";
const TTL_DAYS = 90;

const FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];

// Every read and write is guarded. localStorage throws in a private window and
// in some embedded browsers, and attribution is never worth losing a lead over.
function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.captured_at) return null;
    const age = Date.now() - parsed.captured_at;
    if (age > TTL_DAYS * 86400000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function write(value) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // No storage. The in-memory copy below still serves this page view, which
    // covers the common case of someone converting on the page they landed on.
  }
}

// Held in memory as well as storage, so a blocked localStorage still attributes
// a single-page-view conversion correctly.
let memo = null;

export function captureAttribution() {
  if (typeof window === "undefined") return null;

  const existing = read();
  if (existing) {
    memo = existing;
    return existing;
  }

  const params = new URLSearchParams(window.location.search);
  const captured = { captured_at: Date.now() };
  for (const f of FIELDS) {
    const v = params.get(f);
    if (v) captured[f] = v.slice(0, 300);
  }
  captured.landing_path = window.location.pathname + window.location.search.slice(0, 200);
  captured.referrer = document.referrer ? document.referrer.slice(0, 300) : null;

  // A visit with no campaign parameters and no referrer is direct traffic, and
  // is still worth recording: it is the baseline every paid number is compared
  // against, and an absent row would quietly inflate the paid share.
  memo = captured;
  write(captured);
  return captured;
}

export function getAttribution() {
  if (memo) return memo;
  const stored = read();
  if (stored) memo = stored;
  return memo || {};
}
