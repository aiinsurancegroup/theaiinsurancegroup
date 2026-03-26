import { useState, useEffect, useRef } from "react";

const NAVY = "#1A2B45";
const GOLD = "#B8972A";
const LIGHT_GOLD = "#F5EFE0";
const DARK_BG = "#0F1923";
const WHITE = "#FFFFFF";
const LIGHT_GRAY = "#F7F8FA";
const MID_GRAY = "#6B7280";
const RED = "#DC2626";
const ORANGE = "#EA580C";
const GREEN = "#16A34A";

const questions = [
  {
    id: "industry",
    section: "About Your Business",
    question: "What industry are you in?",
    type: "select",
    options: [
      "Financial Services",
      "Healthcare / Medical",
      "Legal",
      "Technology / Software",
      "Real Estate / Property Management",
      "Marketing / Advertising",
      "Manufacturing",
      "E-Commerce / Retail",
      "Education",
      "Other",
    ],
    weight: 0,
  },
  {
    id: "employees",
    section: "About Your Business",
    question: "How many employees does your company have?",
    type: "select",
    options: ["1-10", "11-50", "51-200", "200+"],
    weight: 0,
  },
  {
    id: "ai_marketing",
    section: "AI Usage",
    question: "Do you use AI tools for marketing, content creation, or social media?",
    subtitle: "This includes tools like ChatGPT, Jasper, Canva AI, Copilot, Claude, or any AI-assisted content generation",
    type: "tristate",
    options: ["Yes", "No", "Not sure"],
    weight_yes: 15,
    weight_unsure: 10,
  },
  {
    id: "ai_hr",
    section: "AI Usage",
    question: "Does your company use AI in hiring, HR, or employee management?",
    subtitle: "This includes AI resume screening, candidate ranking, performance evaluation tools, scheduling optimization, or AI-assisted employee monitoring",
    type: "tristate",
    options: ["Yes", "No", "Not sure"],
    weight_yes: 16,
    weight_unsure: 10,
  },
  {
    id: "ai_decisions",
    section: "AI & Client Impact",
    question: "Does AI influence decisions made for clients or patients?",
    subtitle: "For example: treatment recommendations, financial advice, risk assessments, legal research, or automated client communications",
    type: "tristate",
    options: ["Yes", "No", "Sometimes"],
    weight_yes: 18,
    weight_unsure: 12,
  },
  {
    id: "ai_explainability",
    section: "AI & Client Impact",
    question: "Can you explain how the AI reaches its conclusions?",
    subtitle: "Could you describe to a client, regulator, or jury exactly how an AI tool made a specific recommendation or decision?",
    type: "tristate",
    options: ["Yes", "Partially", "No"],
    weight_yes: -3,
    weight_unsure: 8,
    weight_no: 14,
  },
  {
    id: "ai_disclosure",
    section: "Governance",
    question: "Do you disclose AI usage to clients or patients?",
    subtitle: "Multiple states now require notification when AI is used in certain decisions, particularly in healthcare, employment, and financial services",
    type: "yesno",
    options: ["Yes", "No"],
    weight_no: 12,
  },
  {
    id: "ai_policy",
    section: "Governance",
    question: "Does your company have a written AI usage policy?",
    subtitle: "A formal policy documenting approved AI tools, prohibited uses, data handling requirements, and human oversight procedures",
    type: "tristate",
    options: ["Yes", "No", "Not sure"],
    weight_yes: -5,
    weight_unsure: 8,
    weight_no: 10,
  },
  {
    id: "insurance_review",
    section: "Current Coverage",
    question: "Has your insurance been reviewed for AI-related exposure?",
    subtitle: "Since January 2026, major carriers have been attaching AI exclusions to General Liability, E&O, D&O, and Cyber policies at renewal",
    type: "tristate",
    options: ["Yes", "No", "Not sure"],
    weight_yes: -8,
    weight_unsure: 12,
    weight_no: 15,
  },
  {
    id: "renewal",
    section: "Current Coverage",
    question: "When does your business insurance renew?",
    subtitle: "This helps us determine how urgently you should review your coverage for AI-related exclusions",
    type: "select",
    options: [
      "Within 3 months",
      "3-6 months",
      "6-12 months",
      "Not sure",
    ],
    weight: 0,
  },
];

const riskProfiles = {
  high: {
    color: RED,
    label: "HIGH RISK",
    icon: "\u{1F534}",
    headline: "Your Business Likely Has Significant AI Coverage Gaps",
    body: "Based on your responses, your organization is using AI in ways that may no longer be covered under standard commercial insurance policies. As of January 1, 2026, major carriers began attaching generative AI exclusions to General Liability policies. Your current coverage may not respond to AI-related claims including content liability, chatbot errors, algorithmic discrimination, or AI-driven bodily injury.",
  },
  moderate: {
    color: ORANGE,
    label: "MODERATE RISK",
    icon: "\u{1F7E0}",
    headline: "You May Have Unrecognized AI Exposure",
    body: "Your business has AI exposure that may fall into coverage gaps created by new industry-wide exclusions. Even if your AI usage seems limited, many software platforms now embed AI features without explicit disclosure — meaning your actual exposure may be higher than you realize. A professional review of your policy endorsements is recommended before your next renewal.",
  },
  low: {
    color: GREEN,
    label: "LOWER RISK",
    icon: "\u{1F7E2}",
    headline: "Your AI Exposure Appears Manageable — But Don't Assume You're Covered",
    body: "Your current AI usage appears limited, but the insurance landscape is shifting rapidly. Carriers are adding AI exclusions at renewal regardless of your usage level. A brief policy review can confirm your coverage status and identify any emerging gaps before they become costly surprises.",
  },
};

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ width: "100%", marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: MID_GRAY }}>
        <span>Question {current} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div style={{ width: "100%", height: 6, background: "#E5E7EB", borderRadius: 3 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${NAVY}, ${GOLD})`, borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function HeroSection({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${DARK_BG} 0%, ${NAVY} 100%)`, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: WHITE, fontSize: 16 }}>AI</div>
          <span style={{ color: WHITE, fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>IsYourAICovered<span style={{ color: GOLD }}>.com</span></span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 60px", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(184,151,42,0.15)", border: `1px solid ${GOLD}`, borderRadius: 20, padding: "6px 16px", color: GOLD, fontSize: 13, fontWeight: 600, letterSpacing: 1, marginBottom: 28 }}>
         ⚠ NEW 2026 EXCLUSIONS IN EFFECT
        </div>
        <h1 style={{ color: WHITE, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1 }}>
          Your Insurance Quietly<br />
          <span style={{ color: GOLD }}>Stopped Covering AI</span><br />
          on January 1st.
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 620 }}>
          As of January 2026, major carriers are attaching new AI exclusions to standard General Liability, E&O, D&O, and Cyber policies. Most business owners have no idea.
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, margin: "0 0 40px", maxWidth: 540 }}>
          Take this free 60-second assessment to find out if your business has AI-related coverage gaps — before your next claim gets denied.
        </p>
        <button onClick={onStart} style={{ background: GOLD, color: WHITE, border: "none", borderRadius: 8, padding: "18px 48px", fontSize: 18, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3, boxShadow: "0 4px 24px rgba(184,151,42,0.3)", transition: "transform 0.2s, box-shadow 0.2s" }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(184,151,42,0.4)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(184,151,42,0.3)"; }}>
          Check My Coverage →
        </button>
        <div style={{ marginTop: 48, display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { num: "978%", label: "Growth in AI litigation\n(2021–2025)" },
            { num: "Jan 2026", label: "Verisk GenAI exclusions\ntook effect" },
            { num: "$4M", label: "Average AI-related\nclaim settlement" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{ color: GOLD, fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{stat.num}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ q, current, total, answer, onAnswer, onNext, onBack }) {
  const opts = q.options || (q.type === "yesno" ? ["Yes", "No"] : []);
  return (
    <div style={{ minHeight: "100vh", background: LIGHT_GRAY, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>
        <ProgressBar current={current} total={total} />
        <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, marginBottom: 12 }}>{q.section.toUpperCase()}</div>
        <h2 style={{ color: NAVY, fontSize: 24, fontWeight: 700, lineHeight: 1.3, margin: "0 0 8px" }}>{q.question}</h2>
        {q.subtitle && <p style={{ color: MID_GRAY, fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>{q.subtitle}</p>}

        {q.type === "select" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            {opts.map((opt) => (
              <button key={opt} onClick={() => onAnswer(q.id, opt)} style={{
                padding: "16px 20px", borderRadius: 10, border: `2px solid ${answer === opt ? NAVY : "#E5E7EB"}`,
                background: answer === opt ? NAVY : WHITE, color: answer === opt ? WHITE : NAVY,
                fontSize: 15, fontWeight: 500, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
              }}>{opt}</button>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {opts.map((opt) => (
              <button key={opt} onClick={() => onAnswer(q.id, opt)} style={{
                flex: opts.length <= 2 ? 1 : "none", minWidth: opts.length > 2 ? 120 : undefined,
                padding: "20px 24px", borderRadius: 10, border: `2px solid ${answer === opt ? NAVY : "#E5E7EB"}`,
                background: answer === opt ? NAVY : WHITE, color: answer === opt ? WHITE : NAVY,
                fontSize: 17, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", textAlign: "center",
              }}>{opt}</button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <button onClick={onBack} style={{
            padding: "12px 24px", borderRadius: 8, border: "1px solid #E5E7EB", background: WHITE,
            color: MID_GRAY, fontSize: 14, cursor: "pointer", opacity: current === 1 ? 0.3 : 1,
          }} disabled={current === 1}>← Back</button>
          <button onClick={onNext} disabled={!answer} style={{
            padding: "12px 32px", borderRadius: 8, border: "none",
            background: answer ? NAVY : "#D1D5DB", color: WHITE, fontSize: 14, fontWeight: 600,
            cursor: answer ? "pointer" : "default",
          }}>{current === total ? "See My Results" : "Next →"}</button>
        </div>
      </div>
    </div>
  );
}

function LeadCapture({ onSubmit, riskLevel }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });
  const profile = riskProfiles[riskLevel];
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${DARK_BG} 0%, ${NAVY} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{profile.icon}</div>
        <div style={{ color: profile.color, fontSize: 14, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>YOUR AI COVERAGE RISK: {profile.label}</div>
        <h2 style={{ color: WHITE, fontSize: 28, fontWeight: 700, lineHeight: 1.3, margin: "0 0 16px" }}>{profile.headline}</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, margin: "0 0 32px" }}>
          Enter your details below to receive your personalized AI Coverage Gap Report — including specific policy lines at risk and recommended next steps for your business.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "name", placeholder: "Full Name", type: "text" },
            { key: "email", placeholder: "Business Email", type: "email" },
            { key: "company", placeholder: "Company Name", type: "text" },
            { key: "phone", placeholder: "Phone Number", type: "tel" },
          ].map((f) => (
            <input key={f.key} type={f.type} placeholder={f.placeholder} value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              style={{ width: "100%", padding: "16px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: WHITE, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          ))}
          <button onClick={() => onSubmit(form)} disabled={!form.name || !form.email} style={{
            width: "100%", padding: "18px", borderRadius: 8, border: "none",
            background: form.name && form.email ? GOLD : "rgba(255,255,255,0.1)",
            color: WHITE, fontSize: 16, fontWeight: 700, cursor: form.name && form.email ? "pointer" : "default",
            marginTop: 8, boxSizing: "border-box",
          }}>Get My Free AI Coverage Gap Report →</button>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "4px 0 0" }}>
            Your information is confidential and will only be used to deliver your assessment. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultsPage({ answers, form, riskLevel, riskScore }) {
  const profile = riskProfiles[riskLevel];
  const gaps = [];

  if (answers.ai_marketing === "Yes" || answers.ai_marketing === "Not sure")
    gaps.push({ policy: "General Liability (CGL)", risk: "AI-generated content — marketing, blogs, social media — may trigger defamation, copyright, or privacy claims now excluded under Verisk CG 40 48.", urgency: "HIGH" });
  if (answers.ai_hr === "Yes" || answers.ai_hr === "Not sure")
    gaps.push({ policy: "EPLI (Employment Practices)", risk: "AI in hiring and HR decisions creates discrimination exposure. Multiple states now require disclosure when AI aids employment decisions. EPLI sublimits for AI are appearing at renewal.", urgency: "HIGH" });
  if (answers.ai_decisions === "Yes" || answers.ai_decisions === "Sometimes")
    gaps.push({ policy: "E&O / Professional Liability", risk: "AI-influenced client or patient decisions create professional liability exposure. If the AI is wrong, your E&O policy may exclude the resulting claim under new AI endorsements.", urgency: "HIGH" });
  if (answers.ai_explainability === "No" || answers.ai_explainability === "Partially")
    gaps.push({ policy: "D&O + Regulatory", risk: "Inability to explain AI decision-making exposes your organization to regulatory action and governance liability. Directors and officers may face personal exposure if D&O policies contain AI exclusions.", urgency: "MODERATE" });
  if (answers.ai_disclosure === "No")
    gaps.push({ policy: "Compliance / Regulatory", risk: "Failure to disclose AI usage to clients or patients may violate state disclosure requirements and create additional liability exposure that standard policies were not designed to cover.", urgency: "MODERATE" });
  if (answers.ai_policy !== "Yes")
    gaps.push({ policy: "All Lines — Governance", risk: "No documented AI usage policy. Carriers are increasingly underwriting based on AI governance maturity. Lack of a formal policy may result in broader exclusions, sublimits, or higher premiums at renewal.", urgency: "MODERATE" });
  if (answers.insurance_review !== "Yes")
    gaps.push({ policy: "All Lines — Policy Review", risk: "Your insurance has not been reviewed for AI exclusions since the January 2026 Verisk endorsements took effect. New forms (CG 40 47, CG 40 48, CG 35 08) may already be attached to your policies without your knowledge.", urgency: "HIGH" });

  return (
    <div style={{ minHeight: "100vh", background: LIGHT_GRAY, padding: "40px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48 }}>{profile.icon}</div>
          <div style={{ color: profile.color, fontWeight: 800, fontSize: 14, letterSpacing: 2, margin: "8px 0" }}>AI COVERAGE RISK LEVEL: {profile.label}</div>
          <div style={{ color: NAVY, fontSize: 18, fontWeight: 600, margin: "4px 0 0" }}>Risk Score: {riskScore}/100</div>
        </div>

        <div style={{ background: WHITE, borderRadius: 12, padding: 32, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 style={{ color: NAVY, fontSize: 20, margin: "0 0 8px", fontWeight: 700 }}>{profile.headline}</h3>
          <p style={{ color: MID_GRAY, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{profile.body}</p>
        </div>

        {gaps.length > 0 && (
          <div style={{ background: WHITE, borderRadius: 12, padding: 32, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h3 style={{ color: NAVY, fontSize: 18, margin: "0 0 20px", fontWeight: 700 }}>Identified Coverage Gaps ({gaps.length})</h3>
            {gaps.map((g, i) => (
              <div key={i} style={{ padding: "16px 0", borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: NAVY, fontWeight: 700, fontSize: 15 }}>{g.policy}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: g.urgency === "HIGH" ? RED : ORANGE, background: g.urgency === "HIGH" ? "rgba(220,38,38,0.08)" : "rgba(234,88,12,0.08)", padding: "3px 10px", borderRadius: 4 }}>{g.urgency}</span>
                </div>
                <p style={{ color: MID_GRAY, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{g.risk}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: NAVY, borderRadius: 12, padding: 32, textAlign: "center", marginBottom: 24 }}>
          <h3 style={{ color: WHITE, fontSize: 20, margin: "0 0 12px", fontWeight: 700 }}>What Happens Next?</h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            A specialist from our team will review your assessment and prepare a detailed AI Coverage Gap Analysis for your specific policy portfolio. This includes a review of your current endorsements, identification of specific exclusion forms, and recommendations for affirmative AI coverage options. There is no cost and no obligation.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { step: "1", text: "We review your\nassessment results" },
              { step: "2", text: "We pull your current\npolicy endorsements" },
              { step: "3", text: "You receive a detailed\nGap Analysis report" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", minWidth: 140 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: GOLD, color: WHITE, fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>{s.step}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, whiteSpace: "pre-line", lineHeight: 1.4 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: LIGHT_GOLD, border: `1px solid ${GOLD}`, borderRadius: 12, padding: 24, textAlign: "center" }}>
          <p style={{ color: NAVY, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            <strong>Assessment prepared for {form.name || "you"}</strong>
            {form.company ? ` at ${form.company}` : ""} on{" "}
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
            This assessment is for informational purposes only and does not constitute insurance advice.
            Coverage determinations require review of actual policy documents by a licensed insurance professional.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStageRaw] = useState("hero");
  const setStage = (newStage) => {
    setStageRaw(newStage);
    window.history.replaceState({ stage: newStage }, "");
  };
  useEffect(() => {
    window.history.replaceState({ stage: "hero" }, "");
    window.history.pushState({ stage: "hero" }, "");
    const handlePop = (e) => {
      window.location.replace("https://theaiinsurancegroup.com");
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  useEffect(() => {
    const resetOnReturn = () => {
      if (document.visibilityState === "visible") {
        setStageRaw("hero");
        setCurrentQ(0);
        setAnswers({});
        setForm({});
        setRiskScore(0);
        setRiskLevel("moderate");
      }
    };
   window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    });
    document.addEventListener("visibilitychange", resetOnReturn);
    return () => document.removeEventListener("visibilitychange", resetOnReturn);
  }, []);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({});
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("moderate");

  const calculateRisk = () => {
    let score = 15;
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) return;
      if (q.type === "tristate") {
        if (ans === "Yes" || ans === "Sometimes") score += (q.weight_yes || 0);
        else if (ans === "No") score += (q.weight_no || 0);
        else if (ans === "Not sure" || ans === "Partially") score += (q.weight_unsure || 0);
      } else if (q.type === "yesno") {
        if (ans === "No") score += (q.weight_no || 0);
        if (ans === "Yes") score += (q.weight_yes || 0);
      }
    });
    const highRisk = ["Healthcare / Medical", "Financial Services", "Legal", "Technology / Software"];
    if (highRisk.includes(answers.industry)) score += 8;
    if (answers.employees === "51-200" || answers.employees === "200+") score += 5;
    score = Math.max(10, Math.min(100, score));
    setRiskScore(score);
    setRiskLevel(score >= 55 ? "high" : score >= 30 ? "moderate" : "low");
  };

  const handleAnswer = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateRisk();
      setStage("capture");
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleSubmit = async (formData) => {
    setForm(formData);
    setStage("results");
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "616091eb-05d1-4527-94ce-e52463d79f89",
          replyto: formData.email,
          autoresponse_subject: "Your AI Coverage Gap Assessment Results - Risk Level: " + riskLevel.toUpperCase(),
          autoresponse_message: "Dear " + formData.name + ",\n\nThank you for completing the AI Coverage Gap Assessment at IsYourAICovered.com.\n\nYour Results:\n- Risk Level: " + riskLevel.toUpperCase() + "\n- Risk Score: " + riskScore + "/100\n- Industry: " + (answers.industry || "Not specified") + "\n\nBased on your responses, our team will prepare a personalized AI Coverage Gap Analysis for your business. This includes a review of your current policy endorsements for AI-related exclusions and recommendations for affirmative coverage options.\n\nWhat happens next:\n1. A specialist reviews your assessment within 24 hours\n2. We identify specific exclusion forms in your current policies\n3. You receive a detailed Gap Analysis report at no cost\n\nIn the meantime, here are two things you can do right now:\n- Search your current policies for these keywords: Artificial Intelligence, Algorithm, Machine Learning, Automated Decision, Generative AI\n- Review any endorsements added at your most recent renewal\n\nIf you have questions or would like to schedule a call sooner, reply to this email or contact us at sal@theaiinsurancegroup.com.\n\nSal Martorano\nFounder, The AI Insurance Group\ntheaiinsurancegroup.com\nIsYourAICovered.com",
          autoresponse_from: "The AI Insurance Group <sal@theaiinsurancegroup.com>",
          subject: "New AI Coverage Assessment Lead - " + formData.name,
          from_name: "IsYourAICovered.com",
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          risk_score: riskScore,
          risk_level: riskLevel,
          industry: answers.industry,
          employees: answers.employees,
          uses_ai_marketing: answers.ai_marketing,
          uses_ai_hr: answers.ai_hr,
          ai_influences_decisions: answers.ai_decisions,
          ai_explainability: answers.ai_explainability,
          discloses_ai_usage: answers.ai_disclosure,
          has_ai_policy: answers.ai_policy,
          insurance_reviewed: answers.insurance_review,
          renewal_timing: answers.renewal,
        }),
      });
    } catch (e) {
      console.error("Form submission error:", e);
    }
  };

  if (stage === "hero") return <HeroSection onStart={() => setStage("quiz")} />;
  if (stage === "quiz") return (
    <QuestionCard q={questions[currentQ]} current={currentQ + 1} total={questions.length}
      answer={answers[questions[currentQ].id]} onAnswer={handleAnswer} onNext={handleNext} onBack={handleBack} />
  );
  if (stage === "capture") return <LeadCapture onSubmit={handleSubmit} riskLevel={riskLevel} />;
  return <ResultsPage answers={answers} form={form} riskLevel={riskLevel} riskScore={riskScore} />;
}
