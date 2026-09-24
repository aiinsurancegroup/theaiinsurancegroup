import React from "react";
import LeadForm from "./LeadForm";
import { HOMEOWNERS_CLAIMS, AUTO_CLAIMS } from "./claims";

// Paid-traffic landing pages: /review/homeowners and /review/auto.
//
// Different rules from the site pages, and the differences are the point:
//
//   No navigation. Every link is a way to leave a page we paid to put someone
//   on. The only outbound links are the legal ones a regulator expects, and
//   they open a panel rather than navigating away.
//
//   One message. A visitor arrives from one ad about one thing, so the page
//   makes one argument and asks for one action.
//
//   The form is above the fold on a phone. Ad traffic arrives on a phone, and
//   a form below the fold is a form most people never see. On a narrow screen
//   the headline is followed immediately by the form; everything that explains
//   the offer sits underneath it, because the explanation is what someone
//   scrolls for once the form has caught them.
//
// Every insurance-substantive sentence comes from claims.js rather than being
// written here, so what got approved is what ships.

const NAVY = "#0F2847";
const GOLD = "#B8972A";
const WHITE = "#FFFFFF";
const GRAY = "#6B7280";
const LIGHT = "#F7F8FA";
const BORDER = "#E5E7EB";

const CONFIG = {
  homeowners: {
    product: "home",
    eyebrow: "Free Homeowners Insurance Review",
    claims: HOMEOWNERS_CLAIMS,
  },
  auto: {
    product: "auto",
    eyebrow: "Free Auto Insurance Review",
    claims: AUTO_CLAIMS,
  },
};

export default function LandingPage({ variant, onLegal }) {
  const cfg = CONFIG[variant];
  if (!cfg) return null;
  const { claims } = cfg;

  // A successful lead goes to /thanks/:slug rather than swapping the form for
  // a confirmation. Google Ads should count a conversion on a page load, not a
  // JavaScript event: a page load is far harder to get wrong, it survives the
  // form being rewritten, and it gives the ad platform a URL to match on.
  const goToThanks = (result) => {
    const params = new URLSearchParams();
    params.set("next", result.next || "manual");
    if (result.lead_id) params.set("lead", result.lead_id);
    if (result.questionnaire_slug) params.set("q", result.questionnaire_slug);
    window.location.assign(`/thanks/${variant}?${params.toString()}`);
  };

  return (
    <div style={{ background: LIGHT, minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Wordmark, deliberately not a link. On a page bought with ad money the
          logo is the most-clicked route back out of the funnel. */}
      <div className="lp-head" style={{ background: NAVY, padding: "14px 20px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", color: WHITE, fontSize: 15, fontWeight: 700, letterSpacing: 0.2 }}>
          The AI Insurance Group
        </div>
      </div>

      <div className="lp-grid" style={{
        maxWidth: 1040, margin: "0 auto", padding: "36px 20px 56px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "start",
      }}>
        <div className="lp-copy">
          <div style={{ color: GOLD, fontSize: 12.5, fontWeight: 700, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 12 }}>
            {cfg.eyebrow}
          </div>

          <h1 className="lp-h1" style={{
            color: NAVY, fontSize: "clamp(27px, 4.4vw, 40px)", fontWeight: 800,
            lineHeight: 1.12, letterSpacing: -0.8, margin: "0 0 14px",
          }}>
            {claims.headline.text}
          </h1>

          <p className="lp-sub" style={{ color: GRAY, fontSize: "clamp(15.5px, 2vw, 17.5px)", lineHeight: 1.65, margin: "0 0 22px" }}>
            {claims.subhead.text}
          </p>

          <ul className="lp-proofs" style={{ color: GRAY, fontSize: 15.5, lineHeight: 1.7, margin: "0 0 20px", paddingLeft: 20 }}>
            {claims.proofs.map((p) => <li key={p.text} style={{ marginBottom: 6 }}>{p.text}</li>)}
          </ul>
        </div>

        <div className="lp-form">
          <LeadForm defaultProduct={cfg.product} onSuccess={goToThanks} hideProduct compact />
        </div>
      </div>

      {/* The only links on the page, and they open in place rather than
          navigating away. */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, background: WHITE, padding: "22px 20px 30px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", color: GRAY, fontSize: 12.5, lineHeight: 1.7 }}>
          <div style={{ marginBottom: 6 }}>{claims.licence.text}</div>
          <div style={{ marginBottom: 6 }}>
            The AI Insurance Group · Monmouth County, New Jersey · sal@theaiinsurancegroup.com · 917-981-0245
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["privacy", "terms", "disclosures"].map((k) => (
              <button key={k} type="button" onClick={() => onLegal?.(k)} style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                color: NAVY, fontSize: 12.5, fontWeight: 600, textDecoration: "underline",
                fontFamily: "inherit",
              }}>
                {k === "privacy" ? "Privacy Policy" : k === "terms" ? "Terms" : "Disclosures"}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 820px) {
          /* Form above the fold. The headline earns the scroll, the form takes
             the action, and the explanation waits below for whoever wants it.
             Ordering the copy block after the form is the whole trick. */
          .lp-grid { grid-template-columns: 1fr !important; gap: 14px !important; padding: 14px 18px 40px !important; }
          /* Every pixel above the form is a pixel of form pushed below the
             fold, so the furniture is tightened on a phone rather than the
             consent text, which is the one thing that must not shrink. */
          .lp-head { padding: 9px 18px !important; }
          .lp-copy { display: contents; }
          .lp-copy > div:first-child { order: 1; margin-bottom: 7px !important; font-size: 11.5px !important; }
          .lp-h1 { order: 2; font-size: 24px !important; line-height: 1.15 !important; margin-bottom: 10px !important; }
          .lp-form { order: 3; }
          .lp-sub { order: 4; margin-top: 4px !important; }
          .lp-proofs { order: 5; }
        }
      `}</style>
    </div>
  );
}
