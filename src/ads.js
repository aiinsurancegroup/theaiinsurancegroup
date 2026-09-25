// Google Ads conversion tracking.
//
// ONE PLACE FOR THE TWO IDENTIFIERS. Nothing else in the codebase may contain an
// AW- id or a conversion label; a test fails if one appears anywhere else.
//
// ============================== FILL THESE IN ==============================
// Both come out of the Google Ads UI: Goals > Conversions > Summary, open the
// conversion action, then "Tag setup" > "Install the tag yourself". The snippet
// shown there contains send_to: 'AW-123456789/AbC-D_efGhIjKlMnOp' -- the part
// before the slash is CONVERSION_ID, the part after is CONVERSION_LABEL.
export const CONVERSION_ID = "AW-18472526290";
export const CONVERSION_LABEL = "vI8cCOWZlYUdENLDsehE";
// ===========================================================================

// TWO GUARDS, NOT ONE, because the two identifiers are needed at different
// moments and only one of them is optional in the meantime:
//
//   the tag loader   needs the id alone. It is what reads the gclid off an ad
//                    click and sets Google's cookie, and it has to run on the
//                    landing page. A click that lands before the tag exists can
//                    never be attributed afterwards -- that data is gone, not
//                    delayed -- so this must not wait on the label.
//
//   the conversion   needs both, because send_to is `id/label`. Sending it with
//                    a placeholder label would post conversions against an
//                    action that does not exist: no data, and a tag that looks
//                    live while reporting nothing, which is worse than silence
//                    because it cannot be told apart from a real zero.
const PLACEHOLDER = /_{3,}/;

export const canLoadTag = () =>
  !PLACEHOLDER.test(CONVERSION_ID) && /^AW-\d+$/.test(CONVERSION_ID);

export const canFireConversion = () =>
  canLoadTag() && !PLACEHOLDER.test(CONVERSION_LABEL) && CONVERSION_LABEL.length > 0;

// Kept as the name the rest of the app asks about when it means "fully set up".
export const isConfigured = () => canFireConversion();

// Where the lead id travels between the form and the thanks page.
//
// sessionStorage rather than the URL, deliberately. The url already carries a
// lead id for the questionnaire "Continue" link, but a conversion keyed on a
// query parameter counts anything with that parameter in it: a shared link, a
// bookmark, a URL pasted into a chat, a QA visit. sessionStorage is written
// only by a form that actually submitted, is scoped to the one tab, and dies
// with it -- so the id cannot be forwarded to anyone else.
const LEAD_KEY = "aiig.conversion.lead";
const SENT_KEY = "aiig.conversion.sent";

// The retry window if gtag is not ready: ~3s, longer than a slow tag and
// shorter than a visitor reading the page and leaving.
const RETRY_MS = 300;
const RETRY_TRIES = 10;

// Every access is wrapped: Safari private mode, blocked site data and a few
// embedded webviews throw on access rather than returning null, and a thrown
// storage error in a conversion path would take the thanks page down with it.
const readStore = (k) => { try { return window.sessionStorage.getItem(k); } catch { return null; } };
const writeStore = (k, v) => { try { window.sessionStorage.setItem(k, v); } catch { /* not fatal */ } };

// Called by LeadForm the moment a lead is created, before the redirect.
export function rememberLead(leadId) {
  if (!leadId) return;
  writeStore(LEAD_KEY, String(leadId));
}

export function recallLead() {
  return readStore(LEAD_KEY);
}

// gtag.js, injected once, on every page.
//
// It loads on every route rather than only on /thanks because Google Ads needs
// to see the landing page to read the gclid off the ad click and set its own
// cookie. A tag that only ran on the conversion page would record conversions
// it could not attribute to a campaign.
export function loadGtag() {
  if (typeof window === "undefined" || !canLoadTag()) return false;
  if (window.__aiigGtagLoaded) return true;
  window.__aiigGtagLoaded = true;

  window.dataLayer = window.dataLayer || [];
  // Must be a real function with `arguments`, not a rest-parameter arrow --
  // gtag pushes the arguments object itself and Google's library reads it back.
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONVERSION_ID)}`;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", CONVERSION_ID);
  return true;
}

// The conversion itself. Fires only from /thanks/:slug.
//
// THREE THINGS STOP A DOUBLE COUNT, and they are not redundant:
//   transaction_id  Google's own dedupe. Two events with the same id are
//                   counted once, including across devices and sessions, and
//                   including a visit next week. This is the one that matters.
//   the sent flag   Stops a re-render or an in-tab refresh sending a second
//                   identical event at all, rather than sending it and relying
//                   on Google to discard it.
//   no id, no event A direct visit to /thanks has nothing in sessionStorage, so
//                   there is no conversion to report. Firing an event with no
//                   transaction_id would be an undedupable conversion, which is
//                   exactly how a conversion count inflates.
export function fireConversion() {
  if (typeof window === "undefined" || !canFireConversion()) return { fired: false, reason: "not-configured" };

  const leadId = recallLead();
  if (!leadId) return { fired: false, reason: "no-lead-id" };
  if (readStore(SENT_KEY) === leadId) return { fired: false, reason: "already-sent" };

  // Send, and mark it sent, in one place -- so the sent-flag is only ever
  // written when an event actually went out.
  const send = () => {
    if (readStore(SENT_KEY) === leadId) return false;   // a retry already won
    window.gtag("event", "conversion", {
      send_to: `${CONVERSION_ID}/${CONVERSION_LABEL}`,
      transaction_id: leadId,
    });
    writeStore(SENT_KEY, leadId);
    return true;
  };

  if (typeof window.gtag === "function") {
    send();
    return { fired: true, transaction_id: leadId };
  }

  // gtag is not there yet. It used to give up here, and that lost every real
  // conversion: main.jsx now loads the tag before React mounts, so this should
  // not happen -- but "should not" is not a guarantee. A slow network, a
  // cold cache or an extension that defers third-party scripts all land here,
  // and a conversion that is dropped is gone rather than late.
  //
  // So: poll briefly and fire the moment it appears. RETRY_MS x RETRY_TRIES is
  // about three seconds, comfortably longer than a slow tag and comfortably
  // shorter than a visitor reading the page and leaving.
  let tries = RETRY_TRIES;
  const timer = setInterval(() => {
    if (typeof window.gtag === "function") {
      clearInterval(timer);
      send();
      return;
    }
    if (--tries <= 0) clearInterval(timer);   // give up quietly; nothing is sent
  }, RETRY_MS);

  return { fired: false, reason: "gtag-missing", retrying: true };
}
