import { useState, useEffect } from "react";

const NAVY = "#1A2B45";
const GOLD = "#B8972A";
const DARK = "#0F1923";
const WHITE = "#FFFFFF";
const LIGHT = "#F7F8FA";
const LGOLD = "#F5EFE0";
const GRAY = "#6B7280";
const DGRAY = "#374151";

const Section = ({ children, bg = WHITE, id }) => (
  <section id={id} style={{ background: bg, padding: "80px 24px" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>{children}</div>
  </section>
);

const SectionLabel = ({ text }) => (
  <div style={{ color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>{text}</div>
);

const SectionTitle = ({ text, color = NAVY, align = "left" }) => (
  <h2 style={{ color, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: -0.5, textAlign: align }}>{text}</h2>
);

const BodyText = ({ text, color = DGRAY, align = "left", maxWidth }) => (
  <p style={{ color, fontSize: 17, lineHeight: 1.7, margin: "0 0 16px", textAlign: align, maxWidth }}>{text}</p>
);

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Services", href: "#services" },
    { label: "Industries", href: "#industries" },
    { label: "The Problem", href: "#problem" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled ? "rgba(15,25,35,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(184,151,42,0.15)" : "none",
      transition: "all 0.3s ease",
      padding: scrolled ? "12px 32px" : "20px 32px",
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
       <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: WHITE, fontSize: 14, fontFamily: "Arial, sans-serif" }}>AIG</div>
          <div>
            <span style={{ color: WHITE, fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>The AI Insurance</span>
            <span style={{ color: GOLD, fontWeight: 700, fontSize: 16 }}> Group</span>
          </div>
      </a>
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = GOLD} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}>{l.label}</a>
          ))}
          <a href="https://isyouraicovered.com" target="_blank" rel="noopener noreferrer" style={{
            background: GOLD, color: WHITE, padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700,
            textDecoration: "none", letterSpacing: 0.3, transition: "opacity 0.2s"
          }}>Free Assessment →</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section style={{
      background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 50%, #1e3a5f 100%)`,
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "120px 24px 80px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "10%", right: "-5%", width: 500, height: 500,
        borderRadius: "50%", background: `radial-gradient(circle, rgba(184,151,42,0.06) 0%, transparent 70%)`,
      }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-block", background: "rgba(184,151,42,0.12)", border: `1px solid rgba(184,151,42,0.3)`,
          borderRadius: 20, padding: "6px 16px", color: GOLD, fontSize: 12, fontWeight: 600, letterSpacing: 1.2, marginBottom: 32,
        }}>
          SPECIALIZED AI LIABILITY COVERAGE & RISK ADVISORY
        </div>
        <h1 style={{
          color: WHITE, fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 800,
          lineHeight: 1.08, margin: "0 0 24px", letterSpacing: -1.5, maxWidth: 800,
        }}>
          Your Insurance Changed.<br />
          <span style={{ color: GOLD }}>We Help You Catch Up.</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.65, maxWidth: 600, margin: "0 0 40px" }}>
          As of January 2026, major carriers are excluding AI-related claims from standard commercial policies.
          We audit your coverage, identify the gaps, and place the specialized protection your business needs.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="https://isyouraicovered.com" target="_blank" rel="noopener noreferrer" style={{
            background: GOLD, color: WHITE, border: "none", borderRadius: 8, padding: "18px 36px",
            fontSize: 17, fontWeight: 700, cursor: "pointer", textDecoration: "none",
            boxShadow: "0 4px 24px rgba(184,151,42,0.25)", transition: "transform 0.2s",
          }}>Check Your Coverage →</a>
          <a href="#services" style={{
            background: "transparent", color: WHITE, border: `1px solid rgba(255,255,255,0.25)`,
            borderRadius: 8, padding: "18px 36px", fontSize: 17, fontWeight: 600,
            cursor: "pointer", textDecoration: "none", transition: "border-color 0.2s",
          }}>Our Services</a>
        </div>

        <div style={{ marginTop: 64, display: "flex", gap: 48, flexWrap: "wrap" }}>
          {[
            { icon: "🛡️", label: "Lloyd's of London\nA+ Rated Capacity" },
            { icon: "📋", label: "Comprehensive\nAI Gap Audits" },
            { icon: "⚖️", label: "E&O, D&O, Cyber\n& GL Coverage" },
            { icon: "🏥", label: "Healthcare, Legal\n& Financial Verticals" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28 }}>{item.icon}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.4, whiteSpace: "pre-line" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <Section bg={LIGHT} id="problem">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionLabel text="The Problem" />
        <SectionTitle text="January 1, 2026 Changed Everything." />
        <BodyText text="Verisk — the organization that creates standard policy language for the U.S. insurance industry — released new endorsements that allow carriers to explicitly exclude generative AI-related claims from commercial general liability policies. Major carriers are attaching these exclusions at renewal. Most business owners have no idea." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginTop: 40 }}>
          {[
            { stat: "978%", desc: "Growth in GenAI litigation from 2021 to 2025", source: "Gallagher Re, March 2026" },
            { stat: "$4M", desc: "Average settlement in AI-related lawsuits", source: "Testudo litigation data" },
            { stat: "80%", desc: "Of insurers deploying AI exclusions in at least one core product by 2026", source: "Gallagher Re / Evercore ISI" },
          ].map((s, i) => (
            <div key={i} style={{
              background: WHITE, borderRadius: 12, padding: 28,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: `4px solid ${GOLD}`,
            }}>
              <div style={{ color: NAVY, fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>{s.stat}</div>
              <div style={{ color: DGRAY, fontSize: 14, lineHeight: 1.5, margin: "8px 0 12px" }}>{s.desc}</div>
              <div style={{ color: GRAY, fontSize: 11, fontStyle: "italic" }}>{s.source}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: "🔍",
      title: "AI Coverage Gap Audit",
      desc: "We review your entire commercial insurance portfolio — GL, E&O, D&O, Cyber, EPLI, and Products liability — to identify AI-related exclusions, sublimits, and endorsements that may have been added at your last renewal.",
      details: ["Full AI usage inventory across your organization", "Policy-by-policy exclusion analysis with form numbers cited", "Risk scenario mapping for your specific industry", "Governance recommendations to improve your underwriting profile"],
    },
    {
      icon: "📄",
      title: "AI Liability Placement",
      desc: "We access specialty markets that most brokers can't reach — including Lloyd's of London capacity and Munich Re-backed products — to place affirmative AI coverage that fills the gaps traditional policies now exclude.",
      details: ["Generative AI liability coverage", "AI-specific E&O and professional liability", "AI performance warranties for tech companies", "Supplemental D&O coverage for AI governance risk"],
    },
    {
      icon: "🤝",
      title: "Broker Partnership Program",
      desc: "We partner with P&C brokers who want to offer AI coverage audits to their existing clients without building the specialty expertise in-house. You keep the client relationship — we provide the AI-specific analysis and market access.",
      details: ["White-label AI gap audit reports", "Specialty placement through Lloyd's and Munich Re", "Co-branded client presentations", "CE-eligible training on AI insurance exclusions"],
    },
  ];

  return (
    <Section bg={WHITE} id="services">
      <SectionLabel text="Services" />
      <SectionTitle text="Three Ways We Protect Your Business" />
      <BodyText text="Whether you need a coverage review, specialty placement, or a partner for your brokerage, we have a solution built for the AI insurance gap." maxWidth={600} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, marginTop: 40 }}>
        {services.map((s, i) => (
          <div key={i} style={{
            background: LIGHT, borderRadius: 16, padding: 32,
            border: "1px solid #E5E7EB", transition: "box-shadow 0.3s",
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
            <h3 style={{ color: NAVY, fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>{s.title}</h3>
            <p style={{ color: DGRAY, fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" }}>{s.desc}</p>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {s.details.map((d, j) => (
                <li key={j} style={{ color: GRAY, fontSize: 14, lineHeight: 1.8 }}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function IndustriesSection() {
  const verticals = [
    { icon: "⚖️", name: "Law Firms", risk: "AI-generated briefs with hallucinated citations. AI contract review errors. Malpractice policies may exclude AI-related professional liability claims.", url: "aiexclusion.com/legal" },
    { icon: "🏥", name: "Healthcare & Medical", risk: "AI diagnostic tools, clinical decision support, patient chatbots. Misdiagnosis influenced by AI creates med-mal exposure that may no longer be covered.", url: "healthcareairisk.com" },
    { icon: "💼", name: "Wealth Management & RIAs", risk: "AI portfolio analysis, client communications, compliance monitoring. SEC 'AI washing' enforcement. E&O and D&O gaps for fiduciary AI failures.", url: "wealthairisk.com" },
    { icon: "🏛️", name: "Directors & Officers", risk: "Personal liability for AI governance failures. Berkley-style absolute AI exclusions remove D&O coverage for AI-related board decisions and disclosures.", url: "aiexclusion.com/directors-officers" },
    { icon: "💻", name: "Technology & SaaS", risk: "AI-powered products and services. Products/Completed Operations exclusions (CG 35 08) remove coverage for AI product failures causing harm.", url: "aiexclusion.com/technology" },
    { icon: "📊", name: "Financial Services", risk: "AI in underwriting, credit decisions, trading, and compliance. Regulatory exposure from algorithmic discrimination and automated decision-making.", url: "aiexclusion.com/financial-services" },
  ];

  return (
    <Section bg={LIGHT} id="industries">
      <SectionLabel text="Industries We Serve" />
      <SectionTitle text="AI Risk Is Industry-Specific. Our Expertise Is Too." />
      <BodyText text="Every profession faces different AI exposure. We tailor our audits and coverage recommendations to your industry's specific regulatory environment, liability profile, and AI adoption patterns." maxWidth={650} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginTop: 40 }}>
        {verticals.map((v, i) => (
          <div key={i} style={{
            background: WHITE, borderRadius: 12, padding: 28,
            border: "1px solid #E5E7EB",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 28 }}>{v.icon}</div>
              <h3 style={{ color: NAVY, fontSize: 18, fontWeight: 700, margin: 0 }}>{v.name}</h3>
            </div>
            <p style={{ color: GRAY, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{v.risk}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProcessSection() {
  const steps = [
    { num: "01", title: "Free Assessment", desc: "Complete our 2-minute online assessment to identify your AI exposure level and preliminary coverage gaps.", time: "2 minutes" },
    { num: "02", title: "Coverage Review", desc: "Our team reviews your actual policy documents — endorsements, exclusions, and definitions — across all commercial lines.", time: "48 hours" },
    { num: "03", title: "Gap Analysis Report", desc: "You receive a detailed report showing every AI-related exclusion in your portfolio, mapped to your specific risk scenarios, with severity ratings.", time: "Delivered with review" },
    { num: "04", title: "Coverage Placement", desc: "We access specialty AI liability markets to fill identified gaps with affirmative coverage — backed by Lloyd's and Munich Re capacity.", time: "1–2 weeks" },
  ];

  return (
    <Section bg={WHITE} id="process">
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionLabel text="How It Works" />
        <SectionTitle text="From Assessment to Protection in 4 Steps" />
        <div style={{ marginTop: 40 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 24, padding: "28px 0",
              borderBottom: i < steps.length - 1 ? "1px solid #E5E7EB" : "none",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12, background: i === 0 ? GOLD : LGOLD,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                color: i === 0 ? WHITE : NAVY, fontSize: 18, fontWeight: 800,
              }}>{s.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h3 style={{ color: NAVY, fontSize: 18, fontWeight: 700, margin: 0 }}>{s.title}</h3>
                  <span style={{ color: GOLD, fontSize: 12, fontWeight: 600, background: LGOLD, padding: "4px 12px", borderRadius: 4 }}>{s.time}</span>
                </div>
                <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function AboutSection() {
  return (
    <Section bg={LIGHT} id="about">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <SectionLabel text="About" />
          <SectionTitle text="Wall Street Insight. Insurance Expertise. AI Fluency." />
          <BodyText text="The AI Insurance Group was founded by Sal Martorano, a strategy and business operations executive with deep roots in financial services and institutional risk management." />
          <BodyText text="With FINRA Series 7, 24, 55, 63, and 99 licenses and years of experience in quantitative analytics and institutional trading, Sal brings a rare combination of financial sophistication and insurance expertise to a market that desperately needs both." />
          <BodyText text="We don't just sell policies. We understand systemic risk, correlated exposures, and how one triggering event can cascade across an entire insurance portfolio — because we've seen it happen before." />
          <div style={{ marginTop: 28, display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "FINRA Licensed", detail: "Series 7, 24, 55, 63, 99" },
              { label: "Specialty Markets", detail: "Lloyd's, Munich Re, Admitted" },
              { label: "Based in", detail: "New Jersey, serving nationwide" },
            ].map((c, i) => (
              <div key={i}>
                <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{c.label}</div>
                <div style={{ color: NAVY, fontSize: 14, fontWeight: 600 }}>{c.detail}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${NAVY}, ${DARK})`,
          borderRadius: 20, padding: 48, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(184,151,42,0.08)" }} />
          <div style={{ color: GOLD, fontSize: 14, fontWeight: 700, letterSpacing: 1.5, marginBottom: 20 }}>OUR APPROACH</div>
          <div style={{ color: WHITE, fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 20 }}>
            "Most agents sell line by line. We audit across your entire portfolio — because AI risk doesn't respect policy boundaries."
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>— Sal Martorano, Founder</div>
          <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7 }}>
              This is not research. This is experience. We've spent years inside the institutions that create and transfer risk — and we apply that understanding to protect businesses navigating the AI coverage gap.
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function CTASection() {
  return (
    <section style={{
      background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 100%)`,
      padding: "80px 24px", textAlign: "center",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ color: WHITE, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: -0.5 }}>
          Don't Wait for a Denied Claim<br />to Find Out You're Exposed.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.7, margin: "0 0 36px" }}>
          Take our free 2-minute assessment. Find out if your business has AI-related coverage gaps — before your next renewal.
        </p>
        <a href="https://isyouraicovered.com" target="_blank" rel="noopener noreferrer" style={{
          display: "inline-block", background: GOLD, color: WHITE, borderRadius: 8,
          padding: "20px 48px", fontSize: 18, fontWeight: 700, textDecoration: "none",
          boxShadow: "0 4px 24px rgba(184,151,42,0.3)", letterSpacing: 0.3,
        }}>
          Check My Coverage — Free →
        </a>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 16 }}>
          No obligation. No spam. Takes 2 minutes.
        </p>
      </div>
    </section>
  );
}

function ContactSection() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", phone: "", role: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email) return;
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "616091eb-05d1-4527-94ce-e52463d79f89",
          subject: "New Coverage Review Request - " + contactForm.name,
          from_name: "TheAIInsuranceGroup.com",
          name: contactForm.name,
          email: contactForm.email,
          company: contactForm.company,
          phone: contactForm.phone,
          role: contactForm.role,
          message: contactForm.message,
        }),
      });
      setSubmitted(true);
    } catch (e) {
      console.error("Form error:", e);
    }
  };

  return (
    <Section bg={WHITE} id="contact">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
        <div>
          <SectionLabel text="Contact" />
          <SectionTitle text="Let's Talk About Your Coverage." />
          <BodyText text="Whether you're a business owner concerned about AI exposure, a broker looking for a specialty partner, or an attorney advising clients on AI risk — we're here to help." />
          <div style={{ marginTop: 32 }}>
            {[
              { label: "Email", value: "sal@theaiinsurancegroup.com" },
              { label: "Coverage Assessment", value: "IsYourAICovered.com" },
              { label: "Knowledge Base", value: "AIExclusion.com" },
              { label: "Location", value: "New Jersey | Serving clients nationwide" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid #F3F4F6" }}>
                <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ color: NAVY, fontSize: 16, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: LIGHT, borderRadius: 16, padding: 36 }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h3 style={{ color: NAVY, fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>Request Received</h3>
              <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.6 }}>Thank you. We'll review your information and respond within 24 hours.</p>
            </div>
          ) : (
            <>
              <h3 style={{ color: NAVY, fontSize: 20, fontWeight: 700, margin: "0 0 24px" }}>Request a Coverage Review</h3>
              {[
                { key: "name", placeholder: "Full Name", type: "text" },
                { key: "email", placeholder: "Business Email", type: "email" },
                { key: "company", placeholder: "Company Name", type: "text" },
                { key: "phone", placeholder: "Phone Number", type: "tel" },
              ].map((f, i) => (
                <input key={i} type={f.type} placeholder={f.placeholder} value={contactForm[f.key]}
                  onChange={(e) => setContactForm({ ...contactForm, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: "1px solid #E5E7EB", background: WHITE, fontSize: 15, marginBottom: 12, outline: "none", boxSizing: "border-box", color: NAVY }} />
              ))}
              <select value={contactForm.role} onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: "1px solid #E5E7EB", background: WHITE, fontSize: 15, marginBottom: 12, color: contactForm.role ? NAVY : GRAY, outline: "none", boxSizing: "border-box" }}>
                <option value="">I am a...</option>
                <option>Business Owner / Executive</option>
                <option>Attorney / Law Firm</option>
                <option>Physician / Medical Practice</option>
                <option>Wealth Manager / RIA / Broker-Dealer</option>
                <option>Director / Board Member</option>
                <option>Insurance Broker / Agent</option>
                <option>Other</option>
              </select>
              <textarea placeholder="Tell us about your situation (optional)" rows={3} value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: "1px solid #E5E7EB", background: WHITE, fontSize: 15, marginBottom: 16, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", color: NAVY }} />
              <button onClick={handleContactSubmit}
                style={{ width: "100%", padding: "16px", borderRadius: 8, border: "none", background: NAVY, color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer", boxSizing: "border-box" }}>
                Submit Request →
              </button>
              <p style={{ color: GRAY, fontSize: 12, marginTop: 8, textAlign: "center" }}>Your information is confidential. We respond within 24 hours.</p>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer style={{ background: DARK, padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: WHITE, fontSize: 12 }}>AIG</div>
              <span style={{ color: WHITE, fontWeight: 700, fontSize: 15 }}>The AI Insurance <span style={{ color: GOLD }}>Group</span></span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6, maxWidth: 300 }}>
              Specialized AI liability coverage and risk advisory. Helping businesses navigate the 2026 AI insurance exclusion landscape.
            </p>
          </div>
          <div>
            <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>RESOURCES</div>
            {["Free AI Coverage Assessment", "AI Exclusion Knowledge Base", "Healthcare AI Risk", "Wealth Management AI Risk", "Broker Partnership Program"].map((l, i) => (
              <div key={i} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>COVERAGE LINES</div>
            {["AI Liability (CGL Gap Fill)", "AI Professional Liability (E&O)", "AI Directors & Officers (D&O)", "AI Cyber Liability", "AI Products Liability"].map((l, i) => (
              <div key={i} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            © 2026 The AI Insurance Group. All rights reserved. Insurance products placed through licensed entities.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service", "Disclosures"].map((l, i) => (
              <span key={i} style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", margin: 0, padding: 0 }}>
      <Nav />
      <Hero />
      <ProblemSection />
      <ServicesSection />
      <IndustriesSection />
      <ProcessSection />
      <AboutSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
}
