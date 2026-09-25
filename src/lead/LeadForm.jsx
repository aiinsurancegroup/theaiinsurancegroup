import React, { useEffect, useRef, useState } from "react";
import { captureAttribution, getAttribution } from "./attribution";
import { rememberLead } from "../ads";

// Step 1 of the lead form.
//
// Six fields and a consent box. It exists in this shape because the alternative
// -- putting a 46-question form in front of someone who just clicked an ad --
// produces nothing when they abandon at question twelve. The lead is created
// the moment this submits, and everything after it is enrichment.
//
// Two paths out:
//   A  They attach a policy. That is the end of it: the declarations page
//      carries what the questionnaire would have asked, so asking anyway is
//      asking someone to transcribe a document they just handed over.
//   B  They do not. They go on to the short declarations-level questionnaire,
//      which is nine to eleven questions rather than thirty-seven.
//
// Mobile is the design constraint, not a consideration. Ad traffic arrives on a
// phone, every field is one row, the keyboards are right, and the whole form
// fits a 667px viewport without scrolling to reach the button.

const NAVY = "#0F2847";
const GOLD = "#B8972A";
const WHITE = "#FFFFFF";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const RED = "#DC2626";
const GREEN = "#2F6B4F";

const PRODUCTS = [
  { id: "home", label: "Home" },
  { id: "auto", label: "Auto" },
  { id: "business", label: "Business" },
];

// Shown verbatim, and stored verbatim by the server from its own copy. The two
// must say the same thing: what a person agreed to is the text that was on
// their screen, and a consent record that paraphrases it is worth nothing.
const TCPA_TEXT =
  "By providing my mobile number and checking this box, I agree that The AI Insurance Group may contact me at that number about my insurance review by phone call, text message, or automated or prerecorded means, including at a number I was assigned by a wireless carrier. Consent is not a condition of purchase. Message and data rates may apply. I can opt out at any time by replying STOP.";

const DOCS_TEXT =
  "I authorize The AI Insurance Group to review the insurance documents I upload, for the purpose of identifying coverage gaps, exclusions and other features of my insurance program. I understand my documents are stored securely, are never sold, and are shared only with the service providers used to carry out this review.";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*";

const field = {
  width: "100%", padding: "13px 14px", fontSize: 16, // 16px: anything smaller
  border: `1px solid ${BORDER}`, borderRadius: 8,    // makes iOS zoom on focus
  fontFamily: "inherit", color: NAVY, background: WHITE, boxSizing: "border-box",
};
const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 600, color: NAVY, marginBottom: 4 };

export default function LeadForm({ defaultProduct = "home", compact = false, onSuccess = null, hideProduct = false }) {
  const [product, setProduct] = useState(defaultProduct);
  const [values, setValues] = useState({
    first_name: "", last_name: "", email: "", mobile_phone: "", zip: "",
  });
  const [file, setFile] = useState(null);
  // Set by "No policy handy?" -- it only collapses the secondary button and
  // swaps the helper line. It does not change what gets submitted.
  const [skipUpload, setSkipUpload] = useState(false);
  const [tcpa, setTcpa] = useState(false);
  const [docsOk, setDocsOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);
  const fileRef = useRef(null);
  const rootRef = useRef(null);

  // On a phone the form is tall enough that replacing it with a short
  // confirmation leaves the viewport parked on blank space below where the
  // content now ends. That reads as a failed submission, so the confirmation is
  // scrolled to rather than merely rendered.
  useEffect(() => {
    if (!done || !rootRef.current) return;
    rootRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [done]);

  // Captured on mount rather than at submit, so the campaign that brought
  // someone here survives them browsing before they convert.
  useEffect(() => { captureAttribution(); }, []);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const pickFile = (e) => {
    const f = e.target.files?.[0] || null;
    setError("");
    if (f && f.size > MAX_FILE_BYTES) {
      setError(`That file is ${(f.size / 1048576).toFixed(1)} MB. The limit is 25 MB — send it by email instead and we'll take it from there.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setFile(f);
    if (!f) setDocsOk(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError("");

    if (!tcpa) {
      setError("Please tick the box so we can contact you with your review.");
      return;
    }
    if (file && !docsOk) {
      setError("Please confirm we can review the document you've attached.");
      return;
    }

    setBusy(true);
    try {
      const attr = getAttribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values, product,
          tcpa_consent: tcpa,
          docs_consent: file ? docsOk : false,
          will_upload: !!file,
          file_name: file?.name || null,
          file_size_bytes: file?.size || null,
          utm_source: attr.utm_source, utm_medium: attr.utm_medium,
          utm_campaign: attr.utm_campaign, utm_term: attr.utm_term,
          utm_content: attr.utm_content, gclid: attr.gclid,
          landing_path: attr.landing_path, referrer: attr.referrer,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }

      // The lead exists from here on. Nothing below may fail in a way that
      // makes the visitor think it does not -- an upload that does not land is
      // a document we ask for again, not a lost enquiry.
      let uploaded = false;
      if (file && data.upload?.signed_url) {
        try {
          const put = await fetch(data.upload.signed_url, {
            method: "PUT",
            headers: { "Content-Type": file.type || "application/pdf" },
            body: file,
          });
          if (put.ok) {
            await fetch("/api/lead", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "attach", lead_id: data.lead_id,
                path: data.upload.path, file_name: file.name, file_size_bytes: file.size,
              }),
            });
            uploaded = true;
          }
        } catch {
          // Swallowed on purpose. See above.
        }
      }

      // product is carried out with the result so the caller can build the
      // thanks URL from the line the visitor actually picked, without having
      // to reach back into this component for it.
      const result = { ...data, product, uploaded, uploadError: file && !uploaded };

      // The lead exists, so this is the moment a conversion became real. The id
      // goes where /thanks can read it; the event itself fires there, on a page
      // load, not here on a submit.
      rememberLead(data.lead_id);

      // A caller can take over from here. The paid landing pages do, so a
      // conversion is counted on a page load rather than a JavaScript event.
      // Busy stays true on that path: the navigation is already in flight and
      // re-enabling the button would invite a second submission.
      if (onSuccess) { onSuccess(result); return; }

      setDone(result);
      setBusy(false);
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setBusy(false);
    }
  };

  if (done) {
    // Everyone who did not upload is emailed a secure link, from the server,
    // without being asked. Most people are on a phone and their policy is in a
    // filing cabinet or a different inbox, so an upload button is the wrong
    // question at this moment -- the right one is "where shall we send this".
    const emailedLink = !done.uploaded;
    return (
      <div ref={rootRef} tabIndex={-1} style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: GREEN, marginBottom: 8 }}>
          Thank you — we have your details.
        </div>

        {done.uploaded ? (
          <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            We've received your policy and a licensed agent will review it and be in touch shortly.
            There's nothing else you need to do.
          </p>
        ) : (
          <>
            {done.uploadError && (
              <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: "0 0 10px" }}>
                Your document didn't finish uploading, but we have everything else.
              </p>
            )}
            <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: "0 0 14px" }}>
              We've emailed you a secure link so you can send your policy whenever it's handy.
            </p>
            {done.next === "questionnaire" ? (
              <>
                <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: "0 0 14px" }}>
                  Or answer a few short questions now and we can start without it — about two minutes.
                </p>
                <a href={`/quote/${done.questionnaire_slug}?lead=${done.lead_id}`} style={{
                  display: "inline-block", background: GOLD, color: WHITE, textDecoration: "none",
                  padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 16,
                }}>Continue →</a>
              </>
            ) : (
              <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                A licensed agent will be in touch shortly to go through your cover with you.
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: compact ? 16 : 24 }}>
      {!compact && (
        <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginBottom: 4 }}>Get your free insurance review</div>
      )}
      {!compact && (
        <p style={{ color: GRAY, fontSize: 14, lineHeight: 1.55, margin: "0 0 18px" }}>
          Tell us where to send it. No cost, and no obligation to change anything.
        </p>
      )}

      {/* Hidden on a landing page. /review/homeowners has already said what this
          is about, so asking again spends a chunk of a phone screen re-asking a
          question the visitor answered by clicking the ad. */}
      {!hideProduct && (
        <div style={{ marginBottom: 16 }}>
          <span style={labelStyle}>What would you like reviewed?</span>
          <div style={{ display: "flex", gap: 8 }}>
            {PRODUCTS.map((p) => (
              <button key={p.id} type="button" onClick={() => setProduct(p.id)}
                aria-pressed={product === p.id}
                style={{
                  flex: 1, padding: "12px 4px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  borderRadius: 8, fontFamily: "inherit",
                  border: `1.5px solid ${product === p.id ? GOLD : BORDER}`,
                  background: product === p.id ? "rgba(184,151,42,0.08)" : WHITE,
                  color: product === p.id ? NAVY : GRAY,
                }}>{p.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD FIRST. This block used to sit below the contact fields as a
          dashed box with a bare "Choose File" input, which made the upload --
          the thing that makes a review possible without a questionnaire -- the
          least prominent control on the form. It is now the first choice on the
          form and the only gold control above the submit button.

          Both paths still submit the same form: choosing "answer a few
          questions" does not branch to a different flow, it collapses this
          block and moves to the fields, and a submission with no file already
          triggers the emailed secure upload link. */}
      <div style={{ marginBottom: 14 }}>
        <input id="lf-file" ref={fileRef} type="file" accept={ACCEPT} onChange={pickFile}
               style={{ display: "none" }} />

        {file ? (
          <div style={{
            border: `1.5px solid ${GREEN}`, borderRadius: 8, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span aria-hidden="true" style={{ color: GREEN, fontWeight: 800 }}>✓</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: NAVY, fontWeight: 600,
                           overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {file.name}
            </span>
            <button type="button" onClick={() => { setFile(null); setDocsOk(false); if (fileRef.current) fileRef.current.value = ""; }}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer",
                       color: GRAY, fontSize: 13, fontWeight: 600, textDecoration: "underline", fontFamily: "inherit" }}>
              Remove
            </button>
          </div>
        ) : (
          <>
            <button type="button" onClick={() => fileRef.current?.click()} style={{
              width: "100%", background: GOLD, color: NAVY, border: "none", borderRadius: 8,
              padding: "16px 20px", fontSize: 16.5, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", marginBottom: 8,
            }}>
              Upload my policy (PDF)
            </button>

            {!skipUpload && (
              <button type="button" onClick={() => { setSkipUpload(true); document.getElementById("lf-first")?.focus(); }}
                style={{
                  width: "100%", background: WHITE, color: NAVY, border: `1.5px solid ${BORDER}`,
                  borderRadius: 8, padding: "13px 20px", fontSize: 14.5, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                No policy handy? Answer a few questions
              </button>
            )}

            {/* Consumer language, deliberately. "Upload your declarations page"
                asks someone to know a term they have no reason to know. */}
            <p style={{ color: GRAY, fontSize: 12.5, lineHeight: 1.5, margin: "8px 0 0" }}>
              {skipUpload
                ? "No problem — fill these in and we'll email you a secure link to send it later."
                : "Have it on your phone, in your email, or on paper? A clear photo of your declarations page works."}
            </p>
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <label style={labelStyle} htmlFor="lf-first">First name</label>
          <input id="lf-first" style={field} value={values.first_name} onChange={set("first_name")}
                 autoComplete="given-name" required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="lf-last">Last name</label>
          <input id="lf-last" style={field} value={values.last_name} onChange={set("last_name")}
                 autoComplete="family-name" required />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle} htmlFor="lf-email">Email</label>
        <input id="lf-email" type="email" style={field} value={values.email} onChange={set("email")}
               autoComplete="email" inputMode="email" required />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10, marginBottom: 12 }}>
        <div>
          <label style={labelStyle} htmlFor="lf-phone">Mobile</label>
          <input id="lf-phone" type="tel" style={field} value={values.mobile_phone} onChange={set("mobile_phone")}
                 autoComplete="tel" inputMode="tel" required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="lf-zip">ZIP</label>
          <input id="lf-zip" style={field} value={values.zip} onChange={set("zip")}
                 autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}(-[0-9]{4})?"
                 maxLength={10} required />
        </div>
      </div>

      {/* The documents consent stays attached to the act of sending a document,
          so it only appears once there is one. */}
      {file && (
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={docsOk} onChange={(e) => setDocsOk(e.target.checked)}
                 style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: GRAY, lineHeight: 1.5 }}>{DOCS_TEXT}</span>
        </label>
      )}

      <label style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 12, cursor: "pointer" }}>
        <input type="checkbox" checked={tcpa} onChange={(e) => setTcpa(e.target.checked)}
               style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: GRAY, lineHeight: 1.5 }}>{TCPA_TEXT}</span>
      </label>

      {error && (
        <div role="alert" style={{ background: "#FEF2F2", border: `1px solid ${RED}`, borderRadius: 8,
                                    padding: 12, color: RED, fontSize: 14, marginBottom: 14, lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={busy} style={{
        width: "100%", background: busy ? GRAY : GOLD, color: WHITE, border: "none",
        borderRadius: 8, padding: "16px 24px", fontSize: 17, fontWeight: 700,
        cursor: busy ? "default" : "pointer", fontFamily: "inherit",
      }}>
        {busy ? "Sending…" : "Get my free review →"}
      </button>

      <p style={{ color: GRAY, fontSize: 12, textAlign: "center", margin: "12px 0 0" }}>
        Licensed in New Jersey, Pennsylvania and Florida.
      </p>
    </form>
  );
}
