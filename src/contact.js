// The agency's contact details, in one place.
//
// The number that used to be here was typed out by hand in seven spots across
// two repositories -- the nav, the landing pages, the thanks page, the
// questionnaire, the client PDF -- and it was a personal mobile rather than the
// agency line. A constant is what stops the next change from missing one of
// them. The audit tool has its own copy of this because it is a separate
// deployment; both are listed in the comment there.
//
// AGENCY_PHONE is what a human reads. AGENCY_PHONE_HREF is E.164 so a phone
// dials it correctly from outside the US, and so iOS does not guess.

export const AGENCY_PHONE = "732-314-1093";
export const AGENCY_PHONE_HREF = "tel:+17323141093";
export const AGENCY_EMAIL = "sal@theaiinsurancegroup.com";

// The byline under a blog post, used when the row's own author_bio is null.
//
// MUST MATCH the default on public.blog_posts.author_bio, set by migration 13
// in the ai-policy-audit-tool repository. Two copies exist because the database
// fills new rows and this fills the gap when a row has none, and they are in
// different repositories so nothing enforces the match at build. A test pins
// this string byte for byte; if you change one, change the other and the test.
//
// What was here said "an informational platform focused on AI liability
// coverage and risk advisory" -- the positioning from two rewrites ago, still
// rendering under live posts, and it described the agency as a platform rather
// than a licensed agency. This carries the licence number for the same reason
// the footer does: it is a byline on published writing about insurance.
export const AUTHOR_BIO =
  "Sal Martorano is the founder of The AI Insurance Group, a licensed independent " +
  "insurance agency in New Jersey, Pennsylvania and Florida. NJ Producer License No. 3004245927.";
