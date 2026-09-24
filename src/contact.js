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
