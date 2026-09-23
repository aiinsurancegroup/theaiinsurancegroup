import React, { useEffect, useMemo, useState } from "react";

// Path B: the declarations-level questionnaire.
//
// One section per screen, saved on every advance. Progress is shown as sections
// rather than questions -- "Section 2 of 4" invites someone to finish, while
// "Question 12 of 46" tells them to stop, and the honest count was the reason
// this form was rebuilt in the first place.

const NAVY = "#0F2847";
const GOLD = "#B8972A";
const WHITE = "#FFFFFF";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const RED = "#DC2626";
const GREEN = "#2F6B4F";

const field = {
  width: "100%", padding: "13px 14px", fontSize: 16,
  border: `1px solid ${BORDER}`, borderRadius: 8,
  fontFamily: "inherit", color: NAVY, background: WHITE, boxSizing: "border-box",
};

function Field({ q, value, onChange }) {
  const id = `q-${q.field_key}`;
  const common = { id, value: value ?? "", onChange: (e) => onChange(q.field_key, e.target.value), style: field };
  let input;
  if (q.field_type === "dropdown" && Array.isArray(q.options)) {
    input = (
      <select {...common}>
        <option value="">Select…</option>
        {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else if (q.field_type === "yes_no") {
    input = (
      <select {...common}>
        <option value="">Select…</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    );
  } else if (q.field_type === "textarea") {
    input = <textarea {...common} rows={3} style={{ ...field, resize: "vertical", fontFamily: "inherit" }} />;
  } else {
    // Keyboards matter more than types here: a number field on a phone brings
    // up a keypad, and a date field brings up a picker instead of asking
    // someone to guess a format.
    const type = q.field_type === "number" ? "number" : q.field_type === "date" ? "date" : "text";
    const inputMode = q.field_type === "number" ? "numeric" : undefined;
    input = <input {...common} type={type} inputMode={inputMode} />;
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: NAVY, marginBottom: 6 }}>
        {q.label}{q.required ? "" : <span style={{ color: GRAY, fontWeight: 400 }}> (optional)</span>}
      </label>
      {input}
      {q.help_text && (
        <p style={{ color: GRAY, fontSize: 12.5, lineHeight: 1.5, margin: "6px 0 0" }}>{q.help_text}</p>
      )}
    </div>
  );
}

export default function Questionnaire({ slug, leadId }) {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [answers, setAnswers] = useState({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [submissionId, setSubmissionId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/questionnaire", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "questions", slug }),
        });
        const d = await r.json().catch(() => null);
        if (cancelled) return;
        if (!r.ok) { setState({ loading: false, error: d?.error || "Could not load the questions.", data: null }); return; }
        setState({ loading: false, error: "", data: d });
      } catch {
        if (!cancelled) setState({ loading: false, error: "Could not reach the server.", data: null });
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  // Grouped by the section column, in sort order. Sections are what the
  // declarations page itself is organised by, so they group the way the
  // document does.
  const sections = useMemo(() => {
    const qs = state.data?.questions || [];
    const order = [];
    const bySection = new Map();
    for (const q of qs) {
      const key = q.section || "Details";
      if (!bySection.has(key)) { bySection.set(key, []); order.push(key); }
      bySection.get(key).push(q);
    }
    return order.map((name) => ({ name, questions: bySection.get(name) }));
  }, [state.data]);

  const setAnswer = (k, v) => setAnswers((a) => ({ ...a, [k]: v }));

  const save = async (complete) => {
    setSaving(true);
    try {
      const r = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save", slug, answers, complete,
          lead_id: leadId || null, submission_id: submissionId,
        }),
      });
      const d = await r.json().catch(() => null);
      if (d?.submission_id) setSubmissionId(d.submission_id);
    } catch {
      // Swallowed. A failed autosave must not block someone from carrying on
      // -- the next advance sends the whole answer set again, so one lost
      // request costs nothing as long as they keep going.
    }
    setSaving(false);
  };

  const next = async () => {
    const last = sectionIndex >= sections.length - 1;
    await save(last);
    if (last) { setFinished(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else { setSectionIndex((i) => i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const wrap = { maxWidth: 620, margin: "0 auto", padding: "40px 20px 72px" };

  if (state.loading) {
    return <div style={wrap}><p style={{ color: GRAY }}>Loading…</p></div>;
  }
  if (state.error) {
    return (
      <div style={wrap}>
        <h1 style={{ color: NAVY, fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>We couldn't open that form</h1>
        <p style={{ color: GRAY, lineHeight: 1.6 }}>{state.error}</p>
        <a href="/" style={{ color: NAVY, fontWeight: 600 }}>← Back to the homepage</a>
      </div>
    );
  }
  if (finished) {
    return (
      <div style={wrap}>
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: GREEN, marginBottom: 8 }}>That's everything we need for now.</div>
          <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: "0 0 12px" }}>
            A licensed agent will review your answers and be in touch shortly. If anything else is
            needed, we'll ask when we call — you don't need to come back here.
          </p>
          <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Still have your current policy to hand? The secure link we emailed you is the quickest
            way to send it.
          </p>
        </div>
      </div>
    );
  }

  const section = sections[sectionIndex];
  if (!section) {
    return (
      <div style={wrap}>
        <p style={{ color: GRAY }}>There are no questions to answer here — a licensed agent will be in touch.</p>
      </div>
    );
  }
  const isLast = sectionIndex >= sections.length - 1;

  return (
    <div style={wrap}>
      <a href="/" style={{ color: GRAY, fontSize: 13, textDecoration: "none" }}>← The AI Insurance Group</a>

      <h1 style={{ color: NAVY, fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 800, margin: "16px 0 6px", letterSpacing: -0.4 }}>
        {state.data.title || "A few quick questions"}
      </h1>
      <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" }}>
        These are the details that appear on your declarations page. If you'd rather just send the
        policy, the secure link in your email is quicker.
      </p>

      {/* Sections, not questions. A count of 46 is why this form gets abandoned. */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: GRAY, marginBottom: 6 }}>
          <span>{section.name}</span>
          <span>Section {sectionIndex + 1} of {sections.length}</span>
        </div>
        <div style={{ height: 4, background: BORDER, borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            width: `${((sectionIndex + 1) / sections.length) * 100}%`,
            height: "100%", background: GOLD, transition: "width 0.25s ease",
          }} />
        </div>
      </div>

      <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
        {section.questions.map((q) => (
          <Field key={q.id} q={q} value={answers[q.field_key]} onChange={setAnswer} />
        ))}

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
          {sectionIndex > 0 && (
            <button type="button" onClick={() => { setSectionIndex((i) => i - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{
                padding: "15px 18px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                background: WHITE, color: NAVY, border: `1px solid ${BORDER}`, borderRadius: 8, fontFamily: "inherit",
              }}>Back</button>
          )}
          <button type="button" onClick={next} disabled={saving} style={{
            flex: 1, padding: "16px 24px", fontSize: 17, fontWeight: 700,
            cursor: saving ? "default" : "pointer", fontFamily: "inherit",
            background: saving ? GRAY : GOLD, color: WHITE, border: "none", borderRadius: 8,
          }}>
            {saving ? "Saving…" : isLast ? "Finish" : "Continue →"}
          </button>
        </div>
      </div>

      <p style={{ color: GRAY, fontSize: 12.5, textAlign: "center", margin: "14px 0 0", lineHeight: 1.5 }}>
        Your answers save as you go. Anything you skip, we'll ask about when we call.
      </p>
    </div>
  );
}
