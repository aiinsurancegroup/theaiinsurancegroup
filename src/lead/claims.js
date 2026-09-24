// EVERY INSURANCE-SUBSTANTIVE SENTENCE ON THE PAID LANDING PAGES.
//
// These pages carry a producer licence number, so anything that asserts how
// insurance works, what a policy does, or what a review will find belongs in
// this file rather than scattered through JSX. One file to approve, one file to
// change, and a diff that shows exactly which claim moved.
//
// Marketing copy that makes no claim about insurance is NOT here -- it lives in
// the components. The test is: could a regulator or a disappointed client hold
// us to this sentence? If yes, it goes here.
//
// STATUS: every entry APPROVED 2026-09-24. Entries changed during review carry
// a status line saying what changed and why; the rest shipped as drafted.
//
// Deferred: a /review/auto-nj variant carrying the sharper New Jersey wording
// ("New Jersey lets you buy a policy that covers a fraction of what most
// drivers assume"), to be built when the auto campaign is NJ-only targeted.
// It is true of NJ and untrue of PA and FL, so it needs its own page rather
// than a footnote on a shared one.
//
// Each entry carries:
//   text      what appears on the page
//   basis     why it is defensible, or why it is not
//   risk      what happens if it is wrong
//   alt       a safer wording where I think the drafted one overreaches

export const HOMEOWNERS_CLAIMS = {
  headline: {
    text: "Is your home insured for what it would cost to rebuild today?",
    status: "APPROVED 2026-09-24. Replaced the drafted assertion with a question: " +
      "a statement about a policy we have not seen is the exact error the audit " +
      "tool exists to prevent, and a question invites the reader to check rather " +
      "than telling them they are wrong.",
    basis:
      "The drafted version was WEAK. Most homeowners policies insure the dwelling on a replacement-cost " +
      "basis, not market value, and many carry an inflation-guard endorsement " +
      "that raises Coverage A each year. As written this states something about " +
      "the reader's own policy that is frequently untrue.",
    risk:
      "A reader whose policy does carry replacement cost and inflation guard is " +
      "being told something false about a document we have not seen. It is also " +
      "the headline, so it is the sentence most likely to be quoted back.",
    alt:
      "Is your home insured for what it would cost to rebuild today?",
  },

  subhead: {
    text:
      "Rebuilding costs have risen sharply in recent years. A free review tells you " +
      "what your policy would actually pay — before you need it to.",
    status: "APPROVED 2026-09-24. Two changes. 'Since then' pointed at the old " +
      "headline and dangled once that became a question. 'Most policies haven't' " +
      "was an empirical claim about the market with no source behind it.",
    basis:
      "The drafted version was MIXED. Construction cost inflation since 2020 is well documented and " +
      "defensible. \"Most policies haven't\" is an empirical claim about the " +
      "market that we have no source for.",
    risk:
      "The second sentence is the exposed one. The first and third are fine.",
    alt:
      "Rebuilding costs have risen sharply since then. A free review tells you " +
      "what your policy would actually pay — before you need it to.",
  },

  proofs: [
    {
      text: "We read your actual policy, not a quote form. Have it handy and it takes two minutes.",
      basis: "TRUE and verifiable. It is what the tool does.",
      risk: "None identified.",
      alt: null,
    },
    {
      text: "A licensed agent reviews every finding before you see it.",
      basis:
        "TRUE and enforced in code. The audit tool refuses to finalize a report " +
        "while any finding is unreviewed.",
      risk: "None identified. This is the strongest claim on the page.",
      alt: null,
    },
    {
      text: "No obligation. If your coverage is right, we'll tell you that.",
      basis: "TRUE, and a commitment the agency controls.",
      risk: "None identified.",
      alt: null,
    },
  ],

  licence: {
    text: "Licensed in New Jersey, Pennsylvania and Florida · NJ Producer License No. 3004245927",
    basis: "Factual. Matches the homepage and the audit tool.",
    risk: "Wrong only if the licensed states change.",
    alt: null,
  },
};

export const AUTO_CLAIMS = {
  headline: {
    text: "Is your car insurance actually protecting you?",
    basis: "A question, not an assertion. Nothing to substantiate.",
    risk: "None identified.",
    alt: null,
  },

  subhead: {
    text:
      "A basic auto policy can cover far less than most drivers assume. A free " +
      "review tells you what yours does — in writing.",
    status: "APPROVED 2026-09-24, option (a). The drafted NJ wording was accurate " +
      "for New Jersey and untrue for a Pennsylvania or Florida reader, and this " +
      "page is served to all three. The sharper NJ line is deferred to a future " +
      "/review/auto-nj, to be built when the auto campaign is deliberately " +
      "NJ-only targeted.",
    basis:
      "The drafted version was DEFENSIBLE but state-specific. New Jersey's Basic Policy carries no " +
      "bodily injury liability as standard, which is genuinely far below what " +
      "most drivers assume they hold. It is accurate for NJ and wrong for a " +
      "Pennsylvania or Florida reader, and this page will be served to all three.",
    risk:
      "A PA or FL visitor is told something about their state that is not true " +
      "of it. The ad targeting can be set to NJ, but the page itself does not know.",
    alt:
      "A basic auto policy can cover far less than most drivers assume. A free " +
      "review tells you what yours does — in writing.",
  },

  proofs: [
    {
      text: "We read your actual policy, not a quote form. Have it handy and it takes two minutes.",
      basis: "TRUE and verifiable.",
      risk: "None identified.",
      alt: null,
    },
    {
      text: "A licensed agent reviews every finding before you see it.",
      basis: "TRUE and enforced in code.",
      risk: "None identified.",
      alt: null,
    },
    {
      text: "No obligation. If your coverage is right, we'll tell you that.",
      basis: "TRUE.",
      risk: "None identified.",
      alt: null,
    },
  ],

  licence: {
    text: "Licensed in New Jersey, Pennsylvania and Florida · NJ Producer License No. 3004245927",
    basis: "Factual.",
    risk: "Wrong only if the licensed states change.",
    alt: null,
  },
};

// The turnaround commitment, removed from the drafted copy on instruction:
// "in about a day" became "within two business days" and then was dropped
// entirely, because every finding is reviewed by hand and a number on an ad
// landing page is a promise the review has to keep. Nothing below promises a
// timeframe, and nothing should be added that does.
