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
// STATUS: every entry is AWAITING APPROVAL. Nothing below has shipped.
//
// Each entry carries:
//   text      what appears on the page
//   basis     why it is defensible, or why it is not
//   risk      what happens if it is wrong
//   alt       a safer wording where I think the drafted one overreaches

export const HOMEOWNERS_CLAIMS = {
  headline: {
    text: "Your home is insured for what it was worth when you bought the policy.",
    basis:
      "WEAK. Most homeowners policies insure the dwelling on a replacement-cost " +
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
      "Rebuilding costs have moved a long way since then. Most policies haven't. " +
      "A free review tells you what yours would actually pay — before you need it to.",
    basis:
      "MIXED. Construction cost inflation since 2020 is well documented and " +
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
      "New Jersey lets you buy a policy that covers a fraction of what most " +
      "drivers assume. A free review tells you what yours does — in writing.",
    basis:
      "DEFENSIBLE but state-specific. New Jersey's Basic Policy carries no " +
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
