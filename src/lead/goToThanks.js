// The one way a successful submission leaves the form.
//
// It used to live only in LandingPage, so only the two paid pages redirected to
// /thanks. The homepage form had no onSuccess at all: it swapped itself for an
// inline confirmation, never reached /thanks, and therefore never fired a
// conversion. Every homepage lead -- every coverage box, both hero buttons,
// everything that scrolls to #quote -- was invisible to Google Ads while being
// perfectly visible in the database.
//
// One function, both call sites, so there is a single place where "a lead was
// created" turns into "the conversion page was reached". A second copy is how
// the first divergence happened.

// Split in two on purpose: thanksUrl() holds all the decisions and is a pure
// function a test can call, goToThanks() only performs the navigation. They
// were one function, and the only way to test it was to replace
// window.location -- which jsdom makes non-configurable, so the URL logic went
// untested. Logic that cannot be tested without fighting the environment is
// logic in the wrong place.
export function thanksUrl(result, slug) {
  const params = new URLSearchParams();
  // `next` tells the thanks page what to say: uploaded, questionnaire, manual.
  params.set("next", result?.next || "manual");
  // The lead id is here for the questionnaire "Continue" link. The CONVERSION
  // does not read it -- it reads sessionStorage, written by LeadForm -- because
  // a conversion keyed on a URL counts every copy of that URL.
  if (result?.lead_id) params.set("lead", result.lead_id);
  if (result?.questionnaire_slug) params.set("q", result.questionnaire_slug);
  return `/thanks/${slug}?${params.toString()}`;
}

export function goToThanks(result, slug) {
  window.location.assign(thanksUrl(result, slug));
}

// Which slug the thanks URL carries.
//
// The paid pages pass their variant (homeowners, auto) because the ad promised
// that line. The homepage passes whatever the visitor picked on the form, so
// the URL reflects the same thing. Anything unrecognised falls back rather than
// building /thanks/undefined, which would still render -- routeFromPath accepts
// any slug -- but would be meaningless in an analytics report.
const SLUGS = { home: "home", auto: "auto", business: "business" };
export const slugForProduct = (product) => SLUGS[product] || "review";
