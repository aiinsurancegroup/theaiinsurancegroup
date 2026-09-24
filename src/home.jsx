import React, { useEffect, useRef, useState } from "react";
import { AGENCY_PHONE, AGENCY_PHONE_HREF } from "./contact";
import PhoneIcon from "./PhoneIcon";

// The first two screens of the homepage: hero, licence strip, ticker, and the
// "What should we review?" boxes.
//
// Split out of App.jsx because App.jsx is 1900 lines and these are the sections
// being iterated on. Nothing else moved.

const NAVY = "#121E2D";        // the brand navy, and now the hero's type colour
const NAVY_SOFT = "#0F2847";
const GOLD = "#B8972A";        // bars and buttons
const GOLD_TEXT = "#D4B455";   // lighter gold, only ever on navy
const HIGHLIGHT = "#EEDDA6";   // the marker behind "A licensed agent"
const WHITE = "#FFFFFF";
const GRAY = "#6B7280";
const DGRAY = "#374151";
const BORDER = "#E5E7EB";
const SAND = "#F6F4EF";

const SERIF = "'Source Serif 4', Georgia, 'Times New Roman', serif";
const SANS = "'IBM Plex Sans', 'Inter', -apple-system, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace";

const SUPABASE_URL = "https://dtgsegabaivtgyccrcxi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Z3NlZ2FiYWl2dGd5Y2NyY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjEwNjMsImV4cCI6MjA5MDQzNzA2M30.1iuiE5T0bqYlkxfoNTyi0NRbDMOZpSORSrtmbdomrNQ";

// Every box opens the same start form with its line pre-selected, so the
// question a box asks is the one the form is already set up to answer.
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

// ------------------------------------------------------------------- hero

// The panel is STATIC and labelled SAMPLE. It shows the shape of a review, not
// anyone's review -- the gap, the percentages and the carrier names are
// illustrative. Animating it would make invented numbers look like live output,
// which is the one thing a sample of a regulated deliverable must not do. The
// chip is a compliance control, not decoration: it does not move, fade, or sit
// anywhere it can scroll out of view before the rows do.
const SAMPLE_ROWS = [
  {
    mark: "✓", tone: "done", title: "Policy read",
    detail: "Homeowners declarations, every page",
  },
  {
    mark: "!", tone: "flag", title: "Gap flagged",
    detail: "Home liability sits below what your umbrella requires underneath it",
  },
  {
    mark: "✓", tone: "done", title: "Markets screened and ranked",
    detail: "Matched on appetite, state and limits",
    bars: [
      { label: "Carrier A", pct: 96 },
      { label: "Carrier B", pct: 91 },
      { label: "Carrier C", pct: 88 },
    ],
  },
  {
    mark: "●", tone: "next", title: "Licensed agent review",
    detail: "Quotes confirmed and every finding checked. Then you decide.",
  },
];

function SamplePanel() {
  return (
    <div style={{ background: NAVY, borderRadius: 14, padding: "22px 22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, letterSpacing: 1.6, color: "rgba(255,255,255,0.72)" }}>
          YOUR REVIEW
        </span>
        <span style={{
          fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: 1.2, color: GOLD_TEXT,
          border: `1px solid rgba(212,180,85,0.5)`, borderRadius: 4, padding: "2px 7px",
        }}>
          SAMPLE
        </span>
      </div>

      {SAMPLE_ROWS.map((r, i) => (
        <div key={r.title} style={{
          display: "flex", gap: 12, alignItems: "flex-start",
          paddingTop: i === 0 ? 0 : 15, paddingBottom: 15,
          borderBottom: i === SAMPLE_ROWS.length - 1 ? "none" : "1px solid rgba(255,255,255,0.09)",
        }}>
          <span aria-hidden="true" style={{
            flexShrink: 0, width: 19, height: 19, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: r.tone === "next" ? 8 : 11, fontWeight: 700, marginTop: 1,
            background: r.tone === "flag" ? "rgba(212,180,85,0.18)" : "rgba(255,255,255,0.1)",
            color: r.tone === "flag" ? GOLD_TEXT : "rgba(255,255,255,0.8)",
          }}>{r.mark}</span>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: WHITE, fontSize: 14, fontWeight: 600, fontFamily: SANS, marginBottom: 3 }}>
              {r.title}
            </div>
            <div style={{ color: "rgba(255,255,255,0.58)", fontSize: 13, lineHeight: 1.55, fontFamily: SANS }}>
              {r.detail}
            </div>

            {r.bars && (
              <div style={{ marginTop: 11, display: "grid", gap: 7 }}>
                {r.bars.map((b) => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.6)", width: 62, flexShrink: 0 }}>
                      {b.label}
                    </span>
                    <span style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                      <span style={{ display: "block", width: `${b.pct}%`, height: "100%", borderRadius: 3, background: GOLD }} />
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: GOLD_TEXT, width: 30, textAlign: "right", flexShrink: 0 }}>
                      {b.pct}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Hero({ onPick }) {
  // No line pre-selected: the hero button is the general entry point, so the
  // form opens on its own default rather than guessing a product from a button
  // that never named one.
  const start = () => goToForm(null, onPick);

  return (
    <>
      <section style={{ background: SAND, padding: "116px 24px 60px" }}>
        <div className="hero-grid" style={{
          maxWidth: 1120, margin: "0 auto", display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr", gap: 56, alignItems: "start",
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 11.5, fontWeight: 500, letterSpacing: 1.5,
              color: NAVY, opacity: 0.72, marginBottom: 20,
            }}>
              AI-POWERED INDEPENDENT AGENCY · NJ · PA · FL
            </div>

            <h1 className="hero-h1" style={{
              fontFamily: SERIF, fontWeight: 600, color: NAVY,
              fontSize: "clamp(31px, 4.3vw, 50px)", lineHeight: 1.14,
              letterSpacing: -0.6, margin: "0 0 20px",
            }}>
              Our AI shops the market.{" "}
              <span style={{
                background: HIGHLIGHT, color: NAVY,
                padding: "0.04em 0.16em", borderRadius: 2,
                boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone",
              }}>A licensed agent</span>{" "}
              makes sure it fits.
            </h1>

            {/* Wording is fixed by compliance: "screens the carriers that write
                your kind of risk", not "scans 100+ carriers". Screening is what
                actually happens and is what can be substantiated. */}
            <p className="hero-sub" style={{
              fontFamily: SANS, color: DGRAY, fontSize: "clamp(15.5px, 1.5vw, 17.5px)",
              lineHeight: 1.7, margin: "0 0 28px", maxWidth: 580,
            }}>
              We have access to 100+ carriers. Our AI reads the policy you already have, screens the
              carriers that write your kind of risk, and ranks the best fits. A licensed agent quotes
              them and checks every detail, so you get more protection for every dollar.
            </p>

            <div className="hero-cta" style={{ display: "flex", gap: 11, flexWrap: "wrap", marginBottom: 14 }}>
              <button type="button" onClick={start} style={{
                background: NAVY, color: WHITE, border: "none", borderRadius: 8,
                padding: "16px 28px", fontSize: 16, fontWeight: 600, fontFamily: SANS,
                cursor: "pointer",
              }}>Start my free review</button>
              <a href={AGENCY_PHONE_HREF} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "transparent", color: NAVY, border: `1.5px solid ${NAVY}`,
                borderRadius: 8, padding: "15px 24px", fontSize: 15.5, fontWeight: 600,
                fontFamily: SANS, textDecoration: "none",
              }}><PhoneIcon size={14} />Call {AGENCY_PHONE}</a>
            </div>

            <p style={{ fontFamily: SANS, color: GRAY, fontSize: 13.5, margin: 0 }}>
              The first review is free. No obligation to switch.
            </p>
          </div>

          {/* Desktop: beside the copy. Phone: below both buttons, via order. */}
          <div className="hero-panel"><SamplePanel /></div>
        </div>
      </section>

      <div style={{ background: NAVY, padding: "12px 24px" }}>
        <div className="hero-strip" style={{
          maxWidth: 1120, margin: "0 auto", display: "flex", flexWrap: "wrap",
          alignItems: "center", gap: "6px 14px",
          color: "rgba(255,255,255,0.52)", fontSize: 12, lineHeight: 1.6, fontFamily: SANS,
        }}>
          <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: 1.3, color: GOLD_TEXT }}>
            AI FINDS · HUMANS VERIFY · YOU DECIDE
          </span>
          <span aria-hidden="true">|</span>
          <span>Licensed in NJ, PA and FL</span>
          <span aria-hidden="true">|</span>
          <span>NJ Producer Lic. No. 3004245927</span>
          <span aria-hidden="true">|</span>
          <span>Monmouth County, NJ</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 30px !important; }
          .hero-h1 { font-size: 30px !important; line-height: 1.16 !important; }
          .hero-sub { font-size: 16px !important; }
          .hero-cta > button, .hero-cta > a { flex: 1 1 100%; }
        }
      `}</style>
    </>
  );
}

// ----------------------------------------------------------------- ticker

// Titles only, pulled live. No dates: a headline with an old date on it makes a
// site look abandoned, and the date adds nothing to a one-line link.
//
// If the query fails or comes back empty the whole bar is removed rather than
// rendered empty -- an empty strip under the hero reads as something broken,
// and there is nothing useful to put in it.
export function Ticker({ onOpenPost }) {
  const [posts, setPosts] = useState(null);   // null = still asking, [] = give up
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    let live = true;
    fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?published=eq.true&order=sort_order.desc&select=id,title`,
      { headers: { apikey: SUPABASE_KEY } },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((rows) => { if (live) setPosts(Array.isArray(rows) ? rows.filter((p) => p.title) : []); })
      .catch(() => { if (live) setPosts([]); });
    return () => { live = false; };
  }, []);

  if (!posts || posts.length === 0) return null;

  const isStatic = reduced.current;
  // Duplicated once so the scroll can wrap without a visible jump. Hidden from
  // assistive tech so titles are not announced twice.
  const lane = (ariaHidden) => (
    <div className="tk-lane" aria-hidden={ariaHidden || undefined}>
      {posts.map((p) => (
        <button key={`${ariaHidden ? "b" : "a"}-${p.id}`} type="button"
          onClick={() => onOpenPost?.(p.id)}
          tabIndex={ariaHidden ? -1 : 0}
          className="tk-item">
          {p.title}
        </button>
      ))}
    </div>
  );

  return (
    <div className="tk-wrap"
         onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
         onTouchStart={() => setPaused((p) => !p)}>
      <span className="tk-label">LATEST</span>
      <div className={`tk-track ${isStatic ? "tk-static" : ""} ${paused ? "tk-paused" : ""}`}>
        {lane(false)}
        {!isStatic && lane(true)}
      </div>

      <style>{`
        .tk-wrap {
          background: ${WHITE}; border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; gap: 14px;
          padding: 9px 24px; overflow: hidden;
        }
        .tk-label {
          font-family: ${MONO}; font-size: 10.5px; font-weight: 600; letter-spacing: 1.3;
          color: ${NAVY}; opacity: 0.55; flex-shrink: 0;
        }
        .tk-track { display: flex; min-width: 0; flex: 1; overflow: hidden; }
        .tk-lane { display: flex; flex-shrink: 0; animation: tk-scroll 46s linear infinite; }
        .tk-paused .tk-lane { animation-play-state: paused; }
        /* Static: one lane, scrollable by hand, nothing moving on its own. */
        .tk-static { overflow-x: auto; }
        .tk-static .tk-lane { animation: none; }
        .tk-item {
          background: none; border: none; cursor: pointer; font-family: ${SANS};
          font-size: 13px; color: ${NAVY}; white-space: nowrap;
          padding: 2px 0; margin-right: 34px; text-decoration: none;
        }
        .tk-item:hover, .tk-item:focus-visible { text-decoration: underline; }
        @keyframes tk-scroll { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        @media (prefers-reduced-motion: reduce) {
          .tk-lane { animation: none !important; }
          .tk-track { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}

// -------------------------------------------------------- coverage boxes

export function CoverageBoxes({ onPick }) {
  return (
    <section id="coverage-boxes" style={{ background: SAND, padding: "72px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h2 style={{ color: NAVY_SOFT, fontSize: "clamp(26px, 3.6vw, 36px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 10px" }}>
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
                  <span style={{ color: NAVY_SOFT, fontSize: 16, fontWeight: 700 }}>{c.title}</span>
                  <span style={{ color: GRAY, fontSize: 13.5, lineHeight: 1.6, flex: 1 }}>{c.q}</span>
                  <span className="cov-chev" style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>Start →</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={{
          background: NAVY, borderRadius: 14, padding: "32px 30px", marginTop: 8,
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
