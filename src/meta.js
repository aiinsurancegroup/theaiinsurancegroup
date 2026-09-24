import { HOMEOWNERS_CLAIMS, AUTO_CLAIMS } from "./lead/claims";

// Per-route title, description and robots.
//
// WHY THIS FILE EXISTS. The site is one index.html served for every path, so
// until this ran, /about, /review/homeowners, /review/auto, /quote and /thanks
// all returned the homepage's <title> -- which still described AI liability
// coverage for lawyers and physicians. Google was showing that for every page,
// and an ad landing page whose title has nothing to do with its ad is exactly
// what drags ad relevance down.
//
// The paid pages take their description from claims.js rather than restating
// it. Those sentences are approved, and a meta description is as public as the
// page itself -- there should not be a second, unapproved wording of the same
// claim sitting in the <head> where nobody thinks to review it.
//
// THE LIMIT, STATED PLAINLY. This runs in the browser, so a crawler that does
// not execute JavaScript sees the homepage values from index.html. Google
// renders JS and will pick these up; some scrapers and a few social unfurlers
// will not. Truly static per-page metadata needs either prerendering at build
// or separate HTML entry points, which is a bigger change than this one.

const SITE = "https://theaiinsurancegroup.com";

const HOME = {
  title: "The AI Insurance Group | Free Insurance Policy Review",
  description:
    "Independent insurance agency licensed in New Jersey, Pennsylvania and Florida. " +
    "We read your current home, auto or business policy and tell you what it actually " +
    "covers. Free, no obligation.",
  path: "/",
};

// noindex on the two funnel pages. /thanks is a conversion page -- it should
// never be the result someone clicks from a search, and it would report a
// conversion if it were. /quote carries a lead id in the query string.
const ROUTES = {
  about: {
    title: "About Sal Martorano | The AI Insurance Group",
    description:
      "The AI Insurance Group is a full-service independent insurance agency founded by " +
      "Sal Martorano and licensed in New Jersey, Pennsylvania and Florida.",
    path: "/about",
  },
  "review:homeowners": {
    title: "Free Homeowners Insurance Review | NJ, PA & FL",
    description: HOMEOWNERS_CLAIMS.subhead,
    path: "/review/homeowners",
  },
  "review:auto": {
    title: "Free Auto Insurance Review | NJ, PA & FL",
    description: AUTO_CLAIMS.subhead,
    path: "/review/auto",
  },
  quote: {
    title: "A few quick questions | The AI Insurance Group",
    description: "Tell us what is on your declarations page and a licensed agent will review your cover.",
    robots: "noindex, nofollow",
  },
  thanks: {
    title: "Thank you | The AI Insurance Group",
    description: "We have your details and a licensed agent will be in touch.",
    robots: "noindex, nofollow",
  },
};

export function metaForRoute(route) {
  if (!route) return HOME;
  if (route.kind === "review") return ROUTES[`review:${route.variant}`] || HOME;
  return ROUTES[route.kind] || HOME;
}

// Reuses the tags index.html already ships rather than appending duplicates --
// two <meta name="description"> is its own SEO problem, and this runs again on
// every route change in a session.
function set(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    const m = selector.match(/\[(name|property|rel)="([^"]+)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function applyMeta(route) {
  if (typeof document === "undefined") return;
  const m = metaForRoute(route);

  document.title = m.title;
  set('meta[name="description"]', "content", m.description);
  set('meta[property="og:title"]', "content", m.title);
  set('meta[property="og:description"]', "content", m.description);

  // A canonical pointing at a page with a lead id in it would be wrong, so the
  // noindex routes get no canonical at all rather than a misleading one.
  const canonical = document.head.querySelector('link[rel="canonical"]');
  if (m.path) {
    set('link[rel="canonical"]', "href", SITE + m.path);
    set('meta[property="og:url"]', "content", SITE + m.path);
  } else if (canonical) {
    canonical.remove();
  }

  const robots = document.head.querySelector('meta[name="robots"]');
  if (m.robots) set('meta[name="robots"]', "content", m.robots);
  else if (robots) robots.remove();
}
