", boxShadow: "0 4px 24px rgba(184,151,42,0.3)", letterSpacing: 0.3 }}>Check My Coverage — Free →</a>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 16 }}>No obligation. No spam. Takes 60 seconds.</p>
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
          name: contactForm.name, email: contactForm.email, company: contactForm.company,
          phone: contactForm.phone, role: contactForm.role, message: contactForm.message,
        }),
      });
      setSubmitted(true);
    } catch (e) { console.error("Form error:", e); }
  };
  return (
    <Section bg={WHITE} id="contact">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
        <div>
          <SectionLabel text="Contact" />
          <SectionTitle text="Let's Talk About Your Coverage." />
          <BodyText text="Whether you're a business owner concerned about AI exposure, a broker looking for a specialty partner, or an attorney advising clients on AI risk, we're here to help." />
          <div style={{ marginTop: 32 }}>
            {[
              { label: "Insurance Business / Quotes", value: "smartorano@alexcapinsuranceagency.com" },
              { label: "Platform & General Inquiries", value: "sal@theaiinsurancegroup.com" },
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
                style={{ width: "100%", padding: "16px", borderRadius: 8, border: "none", background: NAVY, color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer", boxSizing: "border-box" }}>Submit Request →</button>
              <p style={{ color: GRAY, fontSize: 12, marginTop: 8, textAlign: "center" }}>Your information is confidential. We respond within 24 hours.</p>
              <p style={{ color: GRAY, fontSize: 10, marginTop: 4, textAlign: "center", lineHeight: 1.5 }}>Insurance products sold through Alexander Capital Insurance Agency, a licensed agency.</p>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

function Footer({ onLegalPage }) {
  return (
    <footer style={{ background: DARK, padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: WHITE, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, letterSpacing: -0.3, fontFamily: "Arial, sans-serif" }}>
                <span style={{ color: GOLD }}>AI</span>
                <span style={{ color: GOLD, margin: "0 1px" }}>·</span>
                <span style={{ color: NAVY }}>IG</span>
              </div>
              <span style={{ color: WHITE, fontWeight: 700, fontSize: 15 }}>The AI Insurance <span style={{ color: GOLD }}>Group</span></span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6, maxWidth: 300 }}>Specialized AI liability coverage and risk advisory. Helping businesses navigate the 2026 AI insurance exclusion landscape.</p>
          </div>
          <div>
            <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>RESOURCES</div>
            {["Free AI Coverage Assessment", "Industry Research", "Blog", "AI Exclusion Knowledge Base", "Healthcare AI Risk", "Wealth Management AI Risk", "Broker Partnership Program"].map((l, i) => (
              <div key={i} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l === "Industry Research" ? <a href="#research" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{l}</a> : l === "Blog" ? <a href="#blog" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{l}</a> : l}</div>
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
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.6, maxWidth: 600 }}>
            © 2026 The AI Insurance Group. All rights reserved. The AI Insurance Group is an informational and marketing platform. Insurance products are sold through Alexander Capital Insurance Agency, a licensed agency.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Privacy Policy", page: "privacy" },
              { label: "Terms of Service", page: "terms" },
              { label: "Disclosures", page: "disclosures" },
            ].map((l, i) => (
              <span key={i} onClick={() => onLegalPage(l.page)} style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>{l.label}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [legalPage, setLegalPage] = useState(null);

  if (legalPage === "privacy") return <PrivacyPolicy onClose={() => setLegalPage(null)} />;
  if (legalPage === "terms") return <TermsOfService onClose={() => setLegalPage(null)} />;
  if (legalPage === "disclosures") return <Disclosures onClose={() => setLegalPage(null)} />;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", margin: 0, paddingTop: "var(--banner-h, 0px)" }}>
      <BreakingBanner />
      <Nav />
      <Hero />
      <ProblemSection />
      <ServicesSection />
      <IndustriesSection />
      <ProcessSection />
      <FAQSection />
      <ResearchSection />
      <BlogSection />
      <CTASection />
      <ContactSection />
      <Footer onLegalPage={setLegalPage} />
    </div>
  );
}
