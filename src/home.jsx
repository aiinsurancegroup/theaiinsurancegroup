import React from "react";
import LeadForm from "./lead/LeadForm";
import { AGENCY_PHONE, AGENCY_PHONE_HREF } from "./contact";
import PhoneIcon from "./PhoneIcon";

// The first two screens of the homepage: hero, licence strip, and the
// "What should we review?" boxes.
//
// Split out of App.jsx because App.jsx is 1900 lines and these three sections
// are the ones being iterated on. Nothing else moved.

const NAVY_DEEP = "#121E2D";   // the hero ground, darker than the page NAVY
const NAVY = "#0F2847";
const GOLD = "#B8972A";        // buttons, as everywhere else on the site
const GOLD_TEXT = "#D4B455";   // lighter gold, for type on navy
const WHITE = "#FFFFFF";
const GRAY = "#6B7280";
const DGRAY = "#374151";
const BORDER = "#E5E7EB";
const SAND = "#F6F4EF";

// Every box below opens the same start form with its line pre-selected, so the
// question a box asks is the question the form is already set up to answer.
// `product` is one of LeadForm's three ids; anything else would silently fall
// back to Home and lose the pre-selection without saying so.
export const GROUPS = [
  {
    key: "personal",
    label: "Personal",
    blurb: "Your home, your cars, and the umbrella over both.",
    cards: [
      { title: "Auto", product: "auto", q: "Are your liability limits high enough for what you own?" },
      { title: "Homeowners", product: "home", q: "Replacement cost or actual cash value — do you know which you have?" },
      { title: "Umbrella", product: "home", q: "Do your home and auto limits actually meet your umbrella's requirements?" },
    ],
  },
  {
    key: "business",
    label: "Business",
    blurb: "Your commercial program, read as one program.",
    cards: [
      { title: "General Liability", product: "business", q: "Does your liability limit meet what your contracts and landlord require?" },
      { title: "Commercial Auto", product: "business", q: "Are employees' own cars covered when they drive for your business?" },
      { title: "Full business review", product: "business", q: "Liability, auto, workers comp and excess — do they actually line up with each other?" },
    ],
  },
  {
    key: "ai",
    label: "AI Risk",
    blurb: "For businesses that use AI in their work.",
    cards: [
      { title: "AI coverage audit", product: "business", wide: true, q: "Does your current policy exclude claims that involve AI?" },
    ],
  },
];

function goToForm(product, onPick) {
  onPick?.(product);
  document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero({ onPick }) {
  const pillars = [
    { h: "AI finds.", p: "Reads every page of every policy and flags gaps and mismatches." },
    { h: "Humans verify.", p: "A licensed agent checks every finding and shops the market." },
    { h: "You decide.", p: "Plain-English findings. No pressure to switch." },
  ];

  return (
    <>
      <section style={{ background: NAVY_DEEP, padding: "104px 24px 64px" }}>
        <div className="hero-grid" style={{
          maxWidth: 1120, margin: "0 auto", display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr", gap: 56, alignItems: "start",
        }}>
          <div>
            {/* Gold, not the red this badge used to be. Red on a hero reads as
                a warning about us rather than a credential. */}
            <div style={{
              display: "inline-block", border: `1px solid rgba(212,180,85,0.45)`, borderRadius: 20,
              padding: "6px 15px", color: GOLD_TEXT, fontSize: 12, fontWeight: 700,
              letterSpacing: 0.8, marginBottom: 22,
            }}>
              Licensed independent agency · NJ · PA · FL
            </div>

            <h1 className="hero-h1" style={{
              color: WHITE, fontSize: "clamp(32px, 4.6vw, 54px)", fontWeight: 800,
              lineHeight: 1.1, letterSpacing: -1.3, margin: "0 0 18px",
            }}>
              Insurance should be reviewed,<br />
              <span style={{ color: GOLD_TEXT }}>not simply renewed.</span>
            </h1>

            <p className="hero-sub" style={{
              color: "rgba(255,255,255,0.74)", fontSize: "clamp(16px, 1.6vw, 18.5px)",
              lineHeight: 1.65, margin: "0 0 34px", maxWidth: 560,
            }}>
              Send us the policy you already have. We'll tell you what it covers, what it doesn't,
              and whether the price still matches. The first review is free.
            </p>

            {/* Phone only: the card is replaced by two buttons, so the first
                screen ends on an action rather than a form someone has to
                scroll past the fold to reach. */}
            <div className="hero-mobile-cta" style={{ display: "none", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
              <button type="button" onClick={() => goToForm("home", onPick)} style={{
                background: GOLD, color: WHITE, border: "none", borderRadius: 8,
                padding: "16px 24px", fontSize: 16, fontWeight: 700, fontFamily: "inherit",
                cursor: "pointer", flex: "1 1 100%",
              }}>Start my free review →</button>
              <a href={AGENCY_PHONE_HREF} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                background: "transparent", color: WHITE, border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 8, padding: "15px 24px", fontSize: 15.5, fontWeight: 600,
                textDecoration: "none", flex: "1 1 100%",
              }}><PhoneIcon size={14} style={{ color: GOLD_TEXT }} />Call {AGENCY_PHONE}</a>
            </div>

            <div className="hero-pillars" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26,
              borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 26,
            }}>
              {pillars.map((p) => (
                <div key={p.h}>
                  <div style={{ color: GOLD_TEXT, fontSize: 15, fontWeight: 700, marginBottom: 7 }}>{p.h}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13.5, lineHeight: 1.6 }}>{p.p}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop card. It is the existing two-step form, not a new one --
              a second form would be a second thing to keep correct. */}
          <div className="hero-card" style={{
            background: WHITE, borderRadius: 14, padding: "26px 24px",
            boxShadow: "0 18px 50px rgba(0,0,0,0.3)",
          }}>
            <h2 style={{ color: NAVY, fontSize: 21, fontWeight: 800, letterSpacing: -0.4, margin: "0 0 4px" }}>
              Start your free review
            </h2>
            <p style={{ color: GRAY, fontSize: 13.5, lineHeight: 1.6, margin: "0 0 18px" }}>
              Upload takes about two minutes. No obligation.
            </p>
            <LeadForm defaultProduct="home" compact />
          </div>
        </div>
      </section>

      {/* Licence strip: the credentials, stated once, directly under the claim
          they back up. */}
      <div style={{ background: "#0C161F", padding: "13px 24px" }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto", color: "rgba(255,255,255,0.5)",
          fontSize: 12.5, lineHeight: 1.6,
        }}>
          Licensed in New Jersey, Pennsylvania and Florida &nbsp;|&nbsp; NJ Producer Lic. No. 3004245927
          &nbsp;|&nbsp; Monmouth County, NJ
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .hero-card { display: none !important; }
          .hero-mobile-cta { display: flex !important; }
          .hero-h1 { font-size: 31px !important; letter-spacing: -0.8px !important; }
          .hero-sub { font-size: 16px !important; margin-bottom: 26px !important; }
          .hero-pillars { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </>
  );
}

export function CoverageBoxes({ onPick }) {
  return (
    <section id="coverage-boxes" style={{ background: SAND, padding: "72px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h2 style={{ color: NAVY, fontSize: "clamp(26px, 3.6vw, 36px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 10px" }}>
          What should we review?
        </h2>
        <p style={{ color: GRAY, fontSize: 17, lineHeight: 1.7, margin: "0 0 40px", maxWidth: 640 }}>
          Pick one, or send us every policy you have and we'll read them together.
        </p>

        {GROUPS.map((g) => (
          <div key={g.key} className="cov-row" style={{
            display: "grid", gridTemplateColumns: "230px 1fr", gap: 36,
            alignItems: "start", marginBottom: 34,
          }}>
            <div className="cov-label">
              <div style={{ color: GOLD, fontSize: 12.5, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 8 }}>
                {g.label}
              </div>
              <p style={{ color: DGRAY, fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{g.blurb}</p>
            </div>

            <div className="cov-cards" style={{
              display: "grid",
              gridTemplateColumns: g.cards.length === 1 ? "1fr" : "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
            }}>
              {g.cards.map((c) => (
                <button key={c.title} type="button" onClick={() => goToForm(c.product, onPick)}
                  className="cov-card"
                  style={{
                    background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12,
                    padding: "18px 18px 16px", textAlign: "left", cursor: "pointer",
                    fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 7,
                  }}>
                  <span style={{ color: NAVY, fontSize: 16, fontWeight: 700 }}>{c.title}</span>
                  <span style={{ color: GRAY, fontSize: 13.5, lineHeight: 1.6, flex: 1 }}>{c.q}</span>
                  <span className="cov-chev" style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>Start →</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={{
          background: NAVY_DEEP, borderRadius: 14, padding: "32px 30px", marginTop: 8,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 26, flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 380px" }}>
            <h3 style={{ color: WHITE, fontSize: 21, fontWeight: 800, letterSpacing: -0.3, margin: "0 0 8px" }}>
              Not sure? Send us everything.
            </h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.65, margin: 0, maxWidth: 560 }}>
              Some gaps only show up when policies are read side by side. Upload them all and we'll
              review your whole program together.
            </p>
          </div>
          <button type="button" onClick={() => goToForm("business", onPick)} style={{
            background: GOLD, color: WHITE, border: "none", borderRadius: 8,
            padding: "16px 28px", fontSize: 16, fontWeight: 700, fontFamily: "inherit",
            cursor: "pointer", whiteSpace: "nowrap",
          }}>Upload all my policies →</button>
        </div>
      </div>

      <style>{`
        .cov-card:hover { border-color: ${GOLD} !important; }
        @media (max-width: 860px) {
          /* Phone: stacked rows with a chevron, not a grid of cards. A card
             grid at this width is just a list with wasted padding. */
          .cov-row { grid-template-columns: 1fr !important; gap: 12px !important; margin-bottom: 26px !important; }
          .cov-cards { grid-template-columns: 1fr !important; gap: 0 !important;
                       border: 1px solid ${BORDER}; border-radius: 12px; overflow: hidden; background: ${WHITE}; }
          .cov-card { border: none !important; border-radius: 0 !important;
                      border-bottom: 1px solid ${BORDER} !important;
                      flex-direction: row !important; align-items: center !important;
                      gap: 12px !important; padding: 15px 16px !important; }
          .cov-cards .cov-card:last-child { border-bottom: none !important; }
          .cov-card > span:nth-child(1) { flex: 0 0 auto; }
          .cov-card > span:nth-child(2) { display: none !important; }
          /* "Start →" becomes a plain chevron in a list row. */
          .cov-chev { margin-left: auto; font-size: 0 !important; }
          .cov-chev::after { content: "\\203A"; font-size: 21px; line-height: 1; color: ${GRAY}; }
        }
      `}</style>
    </section>
  );
}
