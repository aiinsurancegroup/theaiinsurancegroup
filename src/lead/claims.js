// EVERY INSURANCE-SUBSTANTIVE SENTENCE ON THE PAID LANDING PAGES.
//
// These pages carry a producer licence number, so anything asserting how
// insurance works, what a policy does, or what a review will find lives here
// rather than scattered through JSX. One file to approve, one file to change,
// and a diff that shows exactly which claim moved.
//
// Marketing copy making no claim about insurance is NOT here -- it lives in the
// components. The test: could a regulator or a disappointed client hold us to
// this sentence? If yes, it belongs in this file.
//
// WHY THE REASONING IS IN COMMENTS AND NOT IN THE DATA
// It used to be structured fields -- basis, risk, status -- alongside each
// string, and that shipped. Vite bundles an exported object whole, so our own
// assessment that a drafted claim was "WEAK", or "an empirical claim we have no
// source for", sat in the public JavaScript readable by anyone who opened the
// bundle. An internal review note about the strength of our own marketing is
// the last thing that should be published. Comments are stripped at build, so
// the reasoning stays beside the claim in source and never reaches a browser.
// Only the approved sentences below are data.
//
// STATUS: all entries APPROVED 2026-09-24.

// ---------------------------------------------------------------- homeowners
//
// HEADLINE -- approved 2026-09-24, rewritten during review.
//   Drafted: "Your home is insured for what it was worth when you bought the
//   policy." Rejected because most dwellings are written on replacement cost
//   rather than market value, and many carry inflation guard raising Coverage A
//   each year, so the drafted line told readers something frequently untrue
//   about a document we have not seen -- the exact error the audit tool exists
//   to prevent. A question invites them to check instead.
//
// SUBHEAD -- approved 2026-09-24, rewritten during review.
//   Drafted: "Rebuilding costs have moved a long way since then. Most policies
//   haven't. A free review tells you what yours would actually pay -- before
//   you need it to." Two faults: "since then" pointed at the old headline and
//   dangled once that became a question, and the middle sentence was a claim
//   about the market with no source behind it. Construction cost inflation is
//   itself well documented and survives.
//
// PROOFS -- approved as drafted. All three are verifiable. The second is the
//   strongest sentence on either page because it is enforced in code: the audit
//   tool refuses to finalize a report while any finding is unreviewed.
//
// LICENCE -- factual, and the only place the producer number appears in a
//   rendered page. A test fails if it shows up anywhere else.

export const HOMEOWNERS_CLAIMS = {
  headline: "Is your home insured for what it would cost to rebuild today?",

  subhead:
    "Rebuilding costs have risen sharply in recent years. A free review tells you " +
    "what your policy would actually pay — before you need it to.",

  proofs: [
    "We read your actual policy, not a quote form. Have it handy and it takes two minutes.",
    "A licensed agent reviews every finding before you see it.",
    "No obligation. If your coverage is right, we'll tell you that.",
  ],

  licence: "Licensed in New Jersey, Pennsylvania and Florida · NJ Producer License No. 3004245927",

  // EVIDENCE -- approved 2026-09-24. The only external research cited on either
  // page, and the first claim here that rests on somebody else's data rather
  // than on what we do.
  //
  // THE STUDY. Cookson and Gallagher (Leeds School of Business, CU Boulder)
  // with Mulder (UW-Madison), published January 2025: insurance contracts from
  // 24 insurers covering nearly 5,000 policyholders who filed claims after
  // Colorado's 2021 Marshall Fire. 74% underinsured; 36% severely, defined as
  // coverage below 75% of replacement cost. Verified against the CU Boulder
  // release and the authors' own write-up in The Conversation:
  //   colorado.edu/today/2025/01/09/study-reveals-widespread-underinsurance-among-homeowners-exposing-risk-wake-devastating
  //   theconversation.com/many-colorado-homeowners-are-underinsured-heres-what-to-do-before-the-next-fire-263702
  //
  // TWO FIGURES WERE CORRECTED BEFORE APPROVAL, and must not drift back:
  //   "nine in ten had extended coverage"  ->  87%. The authors write
  //     "Eighty-seven percent of the Marshall Fire policies we studied included
  //     extended coverage." Nine in ten rounds past what they said.
  //   "most were still underinsured"  ->  nearly three-quarters. Their words:
  //     "nearly three-quarters of them still fell short of covering the full
  //     cost to rebuild." Stronger than "most", and sourced.
  //
  // ONE FIGURE WAS DROPPED. A $139,000 average coverage gap is widely repeated
  // in secondary coverage but appears in neither the CU Boulder release nor the
  // authors' own article. It is the most quotable number in the whole study,
  // which is exactly why it is not on a page carrying a producer licence until
  // someone reads it in the paper. Do not add it back from a news article.
  //
  // WHY COLORADO IS NAMED TWICE. The population is homeowners who filed claims
  // after one catastrophic total-loss fire in one state. It is not a measured
  // rate for New Jersey, Pennsylvania or Florida, and it is not "74% of
  // homeowners" -- it is 74% of those claimants. Strip either qualifier and a
  // real finding becomes an overstatement.
  evidence: {
    lede: "This isn't just a theory.",
    study:
      "After Colorado's 2021 Marshall Fire, University of Colorado researchers examined " +
      "insurance contracts from 24 insurers covering nearly 5,000 policyholders who filed " +
      "claims. They found 74% were underinsured, and 36% were severely underinsured, with " +
      "coverage limits below 75% of what it would actually cost to rebuild.",
    extended:
      "In the Colorado study, 87% of policies included extended replacement coverage, and " +
      "nearly three-quarters of those homeowners still fell short of the full cost to rebuild.",
    // Attribution, not a claim. An unattributed statistic on a licensed page is
    // weaker than a cited one, and this names who to check.
    source: "Cookson, Gallagher & Mulder, University of Colorado Boulder, 2025",
  },
};

// ---------------------------------------------------------------------- auto
//
// HEADLINE -- approved as drafted. A question, so nothing to substantiate.
//
// SUBHEAD -- approved 2026-09-24 as option (a), rewritten during review.
//   The drafted line named New Jersey and was accurate for its Basic Policy,
//   which carries no bodily injury liability as standard. But /review/auto is
//   served to all three licensed states and the page cannot know which one a
//   reader is in until they type a ZIP -- by which point they have read the
//   headline. The generic wording is true in all three.
//
//   DEFERRED: a /review/auto-nj variant carrying the sharper New Jersey line,
//   to be built when the auto campaign is deliberately NJ-only targeted. It
//   needs its own page rather than a footnote on a shared one.
//
// PROOFS and LICENCE -- identical to homeowners, approved as drafted.

export const AUTO_CLAIMS = {
  headline: "Is your car insurance actually protecting you?",

  subhead:
    "A basic auto policy can cover far less than most drivers assume. A free " +
    "review tells you what yours does — in writing.",

  proofs: [
    "We read your actual policy, not a quote form. Have it handy and it takes two minutes.",
    "A licensed agent reviews every finding before you see it.",
    "No obligation. If your coverage is right, we'll tell you that.",
  ],

  licence: "Licensed in New Jersey, Pennsylvania and Florida · NJ Producer License No. 3004245927",
};

// NO TIMEFRAME IS PROMISED ANYWHERE, and none should be added. The drafted copy
// said "in about a day", which became "within two business days" and was then
// dropped entirely: every finding is reviewed by hand, and a number printed on
// an ad landing page is a promise the review has to keep.
