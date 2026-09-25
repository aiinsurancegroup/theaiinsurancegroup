import React, { useEffect } from "react";
import { AGENCY_PHONE, AGENCY_PHONE_HREF } from "../contact";
import PhoneIcon from "../PhoneIcon";
import { fireConversion } from "../ads";

// /thanks/:slug — the conversion page.
//
// It exists as a real URL rather than a state change so Google Ads can count a
// conversion on a page load. A page load is far harder to get wrong than a
// JavaScript event, it survives the form being rewritten underneath it, and it
// gives the ad platform a URL to match on rather than a tag someone has to
// remember to fire.
//
// Nothing here talks to the database. The lead was created before the redirect
// and this page only reports what happened, which means a visitor who reloads
// it does not create anything and a conversion is not double-counted by a
// refresh -- the ad platform dedupes on its own, but the page should not be
// generating writes on every view either way.
//
// The query string carries next, lead and q. None of those are secrets: the
// lead id is already in the questionnaire URL, and knowing one lets you do
// nothing the lead's own owner could not already do.

const NAVY = "#0F2847";
const GOLD = "#B8972A";
const WHITE = "#FFFFFF";
const GRAY = "#6B7280";
const LIGHT = "#F7F8FA";
const BORDER = "#E5E7EB";
const GREEN = "#2F6B4F";

export default function ThanksPage({ slug, next, leadId, questionnaireSlug }) {
  // The conversion, and the only place it fires. On mount, once, keyed on the
  // lead id held in sessionStorage by the form that created it.
  //
  // Not from the `lead` query parameter, even though one is right there: a
  // conversion keyed on a URL counts every copy of that URL -- a shared link, a
  // bookmark, a QA visit. The query parameter stays for the questionnaire
  // "Continue" link below, which is a navigation rather than a measurement.
  //
  // A direct visit to /thanks has no stored id and fires nothing.
  useEffect(() => { fireConversion(); }, []);

  // Path A: they attached a policy, so there is nothing else to ask for.
  const uploaded = next === "uploaded";
  // Path B: a questionnaire exists for their state and product.
  const canContinue = next === "questionnaire" && questionnaireSlug;

  return (
    <div style={{ background: LIGHT, minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ background: NAVY, padding: "14px 20px" }}>
        <div style={{
          maxWidth: 640, margin: "0 auto", display: "flex",
          justifyContent: "space-between", alignItems: "center", gap: 14,
        }}>
          <div style={{ color: WHITE, fontSize: 15, fontWeight: 700 }}>
            The AI Insurance Group
          </div>
          <a href={AGENCY_PHONE_HREF} style={{
            color: WHITE, fontSize: 15, fontWeight: 700, textDecoration: "none",
            whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
          }}>
            <PhoneIcon size={14} style={{ color: GOLD }} />{AGENCY_PHONE}
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 64px" }}>
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 26 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 }}>
            Request received
          </div>

          <h1 style={{ color: NAVY, fontSize: "clamp(23px, 4vw, 30px)", fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.5, margin: "0 0 14px" }}>
            Thank you — we have your details.
          </h1>

          {uploaded ? (
            <p style={{ color: GRAY, fontSize: 16, lineHeight: 1.65, margin: 0 }}>
              We've received your policy and a licensed agent will review it and be in touch
              shortly. There's nothing else you need to do.
            </p>
          ) : (
            <>
              <p style={{ color: GRAY, fontSize: 16, lineHeight: 1.65, margin: "0 0 14px" }}>
                We've emailed you a secure link so you can send your policy whenever it's handy.
              </p>
              {canContinue ? (
                <>
                  <p style={{ color: GRAY, fontSize: 16, lineHeight: 1.65, margin: "0 0 18px" }}>
                    Or answer a few short questions now and we can start without it — about two
                    minutes.
                  </p>
                  <a href={`/quote/${questionnaireSlug}${leadId ? `?lead=${encodeURIComponent(leadId)}` : ""}`}
                     style={{
                       display: "inline-block", background: GOLD, color: WHITE, textDecoration: "none",
                       padding: "15px 26px", borderRadius: 8, fontWeight: 700, fontSize: 16.5,
                     }}>
                    Continue →
                  </a>
                </>
              ) : (
                <p style={{ color: GRAY, fontSize: 16, lineHeight: 1.65, margin: 0 }}>
                  A licensed agent will be in touch shortly to go through your cover with you.
                </p>
              )}
            </>
          )}
        </div>

        <p style={{ color: GRAY, fontSize: 13.5, lineHeight: 1.65, textAlign: "center", margin: "22px 0 0" }}>
          Anything urgent? Reply to the email we've just sent, or call{" "}
          <a href={AGENCY_PHONE_HREF} style={{ color: NAVY, fontWeight: 600 }}>{AGENCY_PHONE}</a>.
        </p>
      </div>
    </div>
  );
}
