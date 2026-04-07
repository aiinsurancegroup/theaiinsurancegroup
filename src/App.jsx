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

function LegalPage({ title, onClose, children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ minHeight: "100vh", background: WHITE }}>
      <div style={{ background: NAVY, padding: "20px 24px", position: "sticky", top: 0, zIndex: 999 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: WHITE, fontSize: 14 }}>AIG</div>
            <div>
              <span style={{ color: WHITE, fontWeight: 700, fontSize: 16 }}>The AI Insurance</span>
              <span style={{ color: GOLD, fontWeight: 700, fontSize: 16 }}> Group</span>
            </div>
          </a>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: WHITE, padding: "8px 20px", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>← Back to Site</button>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px" }}>
        <h1 style={{ color: NAVY, fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{title}</h1>
        <p style={{ color: GRAY, fontSize: 14, marginBottom: 40 }}>Last updated: March 2026</p>
        <div style={{ color: DGRAY, fontSize: 16, lineHeight: 1.8 }}>{children}</div>
      </div>
    </div>
  );
}

function LegalH2({ children }) { return <h2 style={{ color: NAVY, fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 12 }}>{children}</h2>; }
function LegalP({ children }) { return <p style={{ marginBottom: 16 }}>{children}</p>; }
function LegalUl({ children }) { return <ul style={{ marginBottom: 16, paddingLeft: 24 }}>{children}</ul>; }
function LegalLi({ children }) { return <li style={{ marginBottom: 8, lineHeight: 1.7 }}>{children}</li>; }

function PrivacyPolicy({ onClose }) {
  return (
    <LegalPage title="Privacy Policy" onClose={onClose}>
      <LegalH2>Introduction</LegalH2>
      <LegalP>The AI Insurance Group ("we," "us," or "our") operates theaiinsurancegroup.com and isyouraicovered.com (collectively, the "Sites"). This Privacy Policy describes how we collect, use, and protect your personal information when you visit our Sites or use our services.</LegalP>

      <LegalH2>Information We Collect</LegalH2>
      <LegalP>We collect information you voluntarily provide to us, including:</LegalP>
      <LegalUl>
        <LegalLi>Full name</LegalLi>
        <LegalLi>Business email address</LegalLi>
        <LegalLi>Company name</LegalLi>
        <LegalLi>Phone number</LegalLi>
        <LegalLi>Industry and company size</LegalLi>
        <LegalLi>Responses to our AI Coverage Gap Assessment questionnaire</LegalLi>
        <LegalLi>Any additional information you provide through our contact forms</LegalLi>
      </LegalUl>
      <LegalP>We may also automatically collect certain technical information, including your IP address, browser type, device information, and pages visited through analytics tools such as Google Analytics.</LegalP>

      <LegalH2>How We Use Your Information</LegalH2>
      <LegalP>We use the information we collect to:</LegalP>
      <LegalUl>
        <LegalLi>Deliver your AI Coverage Gap Assessment results</LegalLi>
        <LegalLi>Contact you regarding your assessment results and potential coverage solutions</LegalLi>
        <LegalLi>Connect you with licensed insurance professionals who can assist with your coverage needs</LegalLi>
        <LegalLi>Improve our Sites and services</LegalLi>
        <LegalLi>Send relevant educational content about AI insurance developments (you may opt out at any time)</LegalLi>
      </LegalUl>

      <LegalH2>Information Sharing</LegalH2>
      <LegalP>We may share your information with licensed insurance brokers, agents, and agencies for the purpose of providing you with insurance coverage options. We will not sell your personal information to unrelated third parties for their own marketing purposes.</LegalP>
      <LegalP>We may also share information with service providers who assist in operating our Sites (such as form processing and analytics), and as required by law or to protect our legal rights.</LegalP>

      <LegalH2>Data Security</LegalH2>
      <LegalP>We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.</LegalP>

      <LegalH2>Cookies and Tracking</LegalH2>
      <LegalP>Our Sites may use cookies and similar tracking technologies to improve your experience and analyze site usage. You can control cookie settings through your browser preferences.</LegalP>

      <LegalH2>Your Rights</LegalH2>
      <LegalP>Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or restrict processing of your data. To exercise these rights, contact us at sal@theaiinsurancegroup.com.</LegalP>

      <LegalH2>California Residents</LegalH2>
      <LegalP>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect and the right to request deletion. We do not sell personal information as defined by the CCPA.</LegalP>

      <LegalH2>Changes to This Policy</LegalH2>
      <LegalP>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</LegalP>

      <LegalH2>Contact Us</LegalH2>
      <LegalP>If you have questions about this Privacy Policy, contact us at:<br />The AI Insurance Group<br />Email: sal@theaiinsurancegroup.com</LegalP>
    </LegalPage>
  );
}

function TermsOfService({ onClose }) {
  return (
    <LegalPage title="Terms of Service" onClose={onClose}>
      <LegalH2>Acceptance of Terms</LegalH2>
      <LegalP>By accessing or using theaiinsurancegroup.com and isyouraicovered.com (the "Sites"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Sites.</LegalP>

      <LegalH2>Description of Services</LegalH2>
      <LegalP>The AI Insurance Group provides educational and informational content regarding AI-related insurance risks and coverage options. We also provide a free AI Coverage Gap Assessment tool designed to help businesses identify potential coverage gaps related to artificial intelligence usage.</LegalP>
      <LegalP>The AI Insurance Group is a marketing and informational platform. We are not a licensed insurance agency. Insurance coverage is provided through licensed insurance brokers and agencies. All policies are written and serviced by licensed insurance entities.</LegalP>

      <LegalH2>Not Insurance Advice</LegalH2>
      <LegalP>The information provided on our Sites, including the AI Coverage Gap Assessment results, is for general informational and educational purposes only. It does not constitute insurance advice, legal advice, or a coverage determination. Assessment results are based on self-reported responses and are not a substitute for a professional review of your actual insurance policy documents by a licensed insurance professional.</LegalP>
      <LegalP>Coverage determinations can only be made by reviewing your specific policy language, endorsements, and exclusions. You should consult with a licensed insurance broker or agent regarding your specific coverage needs.</LegalP>

      <LegalH2>No Guarantee of Coverage</LegalH2>
      <LegalP>We do not guarantee that any specific insurance coverage will be available, offered, or bound as a result of using our Sites or services. Insurance availability, terms, conditions, and pricing are determined by insurance carriers and are subject to underwriting approval.</LegalP>

      <LegalH2>Accuracy of Information</LegalH2>
      <LegalP>We make reasonable efforts to ensure the accuracy of information on our Sites, including references to insurance industry developments, carrier actions, and regulatory changes. However, the insurance industry is evolving rapidly, particularly regarding AI-related coverage. We do not warrant that all information is current, complete, or error-free. Users should verify information independently before making coverage decisions.</LegalP>

      <LegalH2>User Responsibilities</LegalH2>
      <LegalP>When using our AI Coverage Gap Assessment or contact forms, you agree to provide accurate and truthful information. You understand that inaccurate responses may result in an inaccurate assessment of your coverage situation.</LegalP>

      <LegalH2>Intellectual Property</LegalH2>
      <LegalP>All content on our Sites, including text, graphics, logos, design elements, and the AI Coverage Gap Assessment tool, is the property of The AI Insurance Group and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without written permission.</LegalP>

      <LegalH2>Limitation of Liability</LegalH2>
      <LegalP>To the fullest extent permitted by law, The AI Insurance Group shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of our Sites or reliance on any information provided, including but not limited to assessment results, coverage recommendations, or educational content.</LegalP>

      <LegalH2>Third-Party Links</LegalH2>
      <LegalP>Our Sites may contain links to third-party websites, including insurance carrier websites, regulatory resources, and industry publications. We are not responsible for the content, accuracy, or practices of third-party sites.</LegalP>

      <LegalH2>Modifications</LegalH2>
      <LegalP>We reserve the right to modify these Terms of Service at any time. Continued use of the Sites following any changes constitutes acceptance of the revised terms.</LegalP>

      <LegalH2>Governing Law</LegalH2>
      <LegalP>These Terms of Service are governed by the laws of the State of New Jersey, without regard to conflict of law principles.</LegalP>

      <LegalH2>Contact</LegalH2>
      <LegalP>For questions about these Terms of Service, contact us at:<br />The AI Insurance Group<br />Email: sal@theaiinsurancegroup.com</LegalP>
    </LegalPage>
  );
}

function Disclosures({ onClose }) {
  return (
    <LegalPage title="Disclosures" onClose={onClose}>
      <LegalH2>About The AI Insurance Group</LegalH2>
      <LegalP>The AI Insurance Group is a marketing and informational platform focused on AI-related insurance risks and coverage solutions. We are not a licensed insurance agency, carrier, or underwriter. Insurance products referenced on our Sites are provided by licensed insurance entities.</LegalP>

      <LegalH2>Insurance Products and Coverage</LegalH2>
      <LegalP>Insurance coverage is provided through licensed insurance brokers, agents, and agencies. All policies are written, issued, and serviced by licensed insurance carriers. The availability of coverage, terms, conditions, limits, and pricing are determined by the issuing carrier and are subject to underwriting review and approval. Not all coverage options are available in all states.</LegalP>

      <LegalH2>AI Coverage Gap Assessment</LegalH2>
      <LegalP>The AI Coverage Gap Assessment tool available at isyouraicovered.com is designed for general informational and educational purposes only. The assessment:</LegalP>
      <LegalUl>
        <LegalLi>Is not a coverage determination or insurance audit</LegalLi>
        <LegalLi>Is based solely on self-reported responses to general questions</LegalLi>
        <LegalLi>Does not review your actual insurance policy documents, endorsements, or exclusions</LegalLi>
        <LegalLi>Does not constitute a professional opinion on your coverage status</LegalLi>
        <LegalLi>Should not be relied upon as a substitute for a professional insurance coverage review</LegalLi>
      </LegalUl>
      <LegalP>Risk scores and coverage gap identifications are estimates based on general industry trends and publicly available information about carrier endorsement practices. Your actual coverage status may differ from the assessment results.</LegalP>

      <LegalH2>Industry Data and Statistics</LegalH2>
      <LegalP>Statistics and data referenced on our Sites are sourced from publicly available industry reports, including but not limited to publications by Gallagher Re, Verisk, Willis Towers Watson (WTW), Testudo, Evercore ISI, and other insurance industry analysts. We attribute sources where practical. These figures represent industry-wide trends and may not reflect your specific situation.</LegalP>

      <LegalH2>Carrier and Product References</LegalH2>
      <LegalP>References to specific insurance carriers, products, endorsement forms (such as Verisk ISO forms CG 40 47, CG 40 48, and CG 35 08), and carrier actions are based on publicly available filings, industry publications, and press releases. These references are provided for educational purposes. Carrier practices, forms, and availability are subject to change. Mention of any carrier or product does not constitute an endorsement or guarantee of availability.</LegalP>

      <LegalH2>Lloyd's of London and Munich Re References</LegalH2>
      <LegalP>References to Lloyd's of London and Munich Re on our Sites refer to the capacity and products available through specialty insurance markets. These references indicate that coverage options exist through these markets via licensed intermediaries. They do not imply a direct relationship, endorsement, or appointment unless specifically stated.</LegalP>

      <LegalH2>FINRA Licensing</LegalH2>
      <LegalP>FINRA Series 7, 24, 55, 63, and 99 licenses referenced on our Sites are held by Sal Martorano individually and pertain to securities industry qualifications. These licenses are referenced to demonstrate financial services expertise and are separate from property and casualty insurance licensing.</LegalP>

      <LegalH2>Lead Generation Disclosure</LegalH2>
      <LegalP>Information submitted through our assessment tools and contact forms may be shared with licensed insurance professionals, including brokers, agents, and agencies, for the purpose of providing you with insurance coverage options and quotes. By submitting your information, you consent to being contacted by licensed insurance professionals regarding coverage solutions relevant to your assessment results.</LegalP>

      <LegalH2>Compensation Disclosure</LegalH2>
      <LegalP>The AI Insurance Group may receive compensation in the form of referral fees, commissions, or advertising revenue in connection with insurance products presented to users of our Sites. This compensation does not affect the information or assessment results provided to you.</LegalP>

      <LegalH2>Contact</LegalH2>
      <LegalP>For questions about these disclosures, contact us at:<br />The AI Insurance Group<br />Email: sal@theaiinsurancegroup.com</LegalP>
    </LegalPage>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    { label: "Research", href: "#research" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled || menuOpen ? "rgba(15,25,35,0.97)" : "transparent",
      backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(184,151,42,0.15)" : "none",
      transition: "all 0.3s ease",
      padding: scrolled ? "12px 24px" : "20px 24px",
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: WHITE, fontSize: 14, fontFamily: "Arial, sans-serif" }}>AIG</div>
          <div>
            <span style={{ color: WHITE, fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>The AI Insurance</span>
            <span style={{ color: GOLD, fontWeight: 700, fontSize: 16 }}> Group</span>
          </div>
        </a>
        <div onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", cursor: "pointer", flexDirection: "column", gap: 5 }} className="mobile-menu-btn">
          <div style={{ width: 24, height: 2, background: WHITE, borderRadius: 1 }} />
          <div style={{ width: 24, height: 2, background: WHITE, borderRadius: 1 }} />
          <div style={{ width: 24, height: 2, background: WHITE, borderRadius: 1 }} />
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{l.label}</a>
          ))}
          <a href="https://isyouraicovered.com?new=1" style={{
            background: GOLD, color: WHITE, padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700,
            textDecoration: "none", letterSpacing: 0.3
          }}>Free Assessment →</a>
          <a href="https://audit.theaiinsurancegroup.com" target="_blank" rel="noopener noreferrer" style={{ background: "transparent", color: GOLD, padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: 0.3, border: "1px solid #B8972A" }}>Audit Portal</a>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .nav-links {
            ${menuOpen ? `
              display: flex !important;
              flex-direction: column;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: rgba(15,25,35,0.98);
              padding: 20px 24px;
              gap: 20px;
              border-top: 1px solid rgba(184,151,42,0.15);
            ` : `display: none !important;`}
          }
        }
      `}</style>
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
          We help businesses identify potential AI-related coverage gaps and connect them with licensed insurance professionals who specialize in this emerging risk.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="https://isyouraicovered.com?new=1" style={{
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
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 16, maxWidth: 600 }}>
          The AI Insurance Group is an informational platform. Insurance coverage is provided through licensed insurance professionals.
        </p>

        <div style={{ marginTop: 48, display: "flex", gap: 48, flexWrap: "wrap" }}>
          {[
            { icon: "🛡️", label: "Specialty Market\nA+ Rated Capacity" },
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
        <div style={{ background: WHITE, borderRadius: 12, padding: 24, marginTop: 24, marginBottom: 16, border: "1px solid #E5E7EB" }}>
          <div style={{ color: NAVY, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📄 Proof: Read the actual exclusion forms</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a href="https://www.independentagent.com/vu_resource/verisk-to-roll-out-new-general-liability-exclusions-for-generative-ai-exposures/" target="_blank" rel="noopener noreferrer" style={{ color: GOLD, fontSize: 14, textDecoration: "none", fontWeight: 600 }}>→ Independent Agents: Verisk Rolls Out New AI Exclusions (January 2026)</a>
            <a href="https://assets.alm.com/63/68/46ed4bf34a0e807c9695e15c9e19/cg-40-48-01-26-exclusion-generative-artificial-intelligence-coverage-b-only.pdf" target="_blank" rel="noopener noreferrer" style={{ color: GOLD, fontSize: 14, textDecoration: "none", fontWeight: 600 }}>→ Verisk Form CG 40 48 — AI Exclusion (Actual PDF)</a>
            <a href="https://www.techlifefuture.com/ai-insurance-exclusions-sme/" target="_blank" rel="noopener noreferrer" style={{ color: GOLD, fontSize: 14, textDecoration: "none", fontWeight: 600 }}>→ The Silent AI Insurance Crisis: SME Coverage Gaps in 2026</a>
          </div>
        </div>
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
    { icon: "🔍", title: "AI Coverage Gap Audit", desc: "We review your entire commercial insurance portfolio — GL, E&O, D&O, Cyber, EPLI, and Products liability — to identify AI-related exclusions, sublimits, and endorsements that may have been added at your last renewal.", details: ["Full AI usage inventory across your organization", "Policy-by-policy exclusion analysis with form numbers cited", "Risk scenario mapping for your specific industry", "Governance recommendations to improve your underwriting profile"] },
    { icon: "📄", title: "AI Liability Solutions", desc: "We connect you with specialty markets that most brokers can't access — including Lloyd's of London capacity and Munich Re-backed products — where licensed professionals can place affirmative AI coverage that fills the gaps traditional policies now exclude.", details: ["Generative AI liability coverage", "AI-specific E&O and professional liability", "AI performance warranties for tech companies", "Supplemental D&O coverage for AI governance risk"] },
    { icon: "🤝", title: "Broker Partnership Program", desc: "We partner with P&C brokers who want to offer AI coverage audits to their existing clients without building the specialty expertise in-house. You keep the client relationship — we provide the AI-specific analysis and market access.", details: ["White-label AI gap audit reports", "Specialty placement through Lloyd's and Munich Re", "Co-branded client presentations", "CE-eligible training on AI insurance exclusions"] },
  ];
  return (
    <Section bg={WHITE} id="services">
      <SectionLabel text="Services" />
      <SectionTitle text="Three Ways We Protect Your Business" />
      <BodyText text="Whether you need a coverage review, specialty placement, or a partner for your brokerage, we have a solution built for the AI insurance gap." maxWidth={600} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, marginTop: 40 }}>
        {services.map((s, i) => (
          <div key={i} style={{ background: LIGHT, borderRadius: 16, padding: 32, border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
            <h3 style={{ color: NAVY, fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>{s.title}</h3>
            <p style={{ color: DGRAY, fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" }}>{s.desc}</p>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {s.details.map((d, j) => (<li key={j} style={{ color: GRAY, fontSize: 14, lineHeight: 1.8 }}>{d}</li>))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function IndustriesSection() {
  const verticals = [
    { icon: "⚖️", name: "Law Firms", risk: "AI-generated briefs with hallucinated citations. AI contract review errors. Malpractice policies may exclude AI-related professional liability claims." },
    { icon: "🏥", name: "Healthcare & Medical", risk: "AI diagnostic tools, clinical decision support, patient chatbots. Misdiagnosis influenced by AI creates med-mal exposure that may no longer be covered." },
    { icon: "💼", name: "Wealth Management & RIAs", risk: "AI portfolio analysis, client communications, compliance monitoring. SEC 'AI washing' enforcement. E&O and D&O gaps for fiduciary AI failures." },
    { icon: "🏛️", name: "Directors & Officers", risk: "Personal liability for AI governance failures. Berkley-style absolute AI exclusions remove D&O coverage for AI-related board decisions and disclosures." },
    { icon: "💻", name: "Technology & SaaS", risk: "AI-powered products and services. Products/Completed Operations exclusions (CG 35 08) remove coverage for AI product failures causing harm." },
    { icon: "📊", name: "Financial Services", risk: "AI in underwriting, credit decisions, trading, and compliance. Regulatory exposure from algorithmic discrimination and automated decision-making." },
  ];
  return (
    <Section bg={LIGHT} id="industries">
      <SectionLabel text="Industries We Serve" />
      <SectionTitle text="AI Risk Is Industry-Specific. Our Expertise Is Too." />
      <BodyText text="Every profession faces different AI exposure. We tailor our audits and coverage recommendations to your industry's specific regulatory environment, liability profile, and AI adoption patterns." maxWidth={650} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginTop: 40 }}>
        {verticals.map((v, i) => (
          <div key={i} style={{ background: WHITE, borderRadius: 12, padding: 28, border: "1px solid #E5E7EB" }}>
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
    { num: "01", title: "Free Assessment", desc: "Complete our 60-second online assessment to identify your AI exposure level and preliminary coverage gaps.", time: "60 seconds" },
    { num: "02", title: "Coverage Review", desc: "Our team reviews your actual policy documents — endorsements, exclusions, and definitions — across all commercial lines.", time: "48 hours" },
    { num: "03", title: "Gap Analysis Report", desc: "You receive a detailed report showing every AI-related exclusion in your portfolio, mapped to your specific risk scenarios, with severity ratings.", time: "Delivered with review" },
    { num: "04", title: "Coverage Solutions", desc: "Licensed insurance professionals access specialty AI liability markets to fill identified gaps with affirmative coverage — backed by Lloyd's and Munich Re capacity.", time: "1–2 weeks" },
  ];
  return (
    <Section bg={WHITE} id="process">
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionLabel text="How It Works" />
        <SectionTitle text="From Assessment to Protection in 4 Steps" />
        <div style={{ marginTop: 40 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 24, padding: "28px 0", borderBottom: i < steps.length - 1 ? "1px solid #E5E7EB" : "none" }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: i === 0 ? GOLD : LGOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: i === 0 ? WHITE : NAVY, fontSize: 18, fontWeight: 800 }}>{s.num}</div>
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
        <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${DARK})`, borderRadius: 20, padding: 48, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(184,151,42,0.08)" }} />
          <div style={{ color: GOLD, fontSize: 14, fontWeight: 700, letterSpacing: 1.5, marginBottom: 20 }}>OUR APPROACH</div>
          <div style={{ color: WHITE, fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 20 }}>"Most agents sell line by line. We audit across your entire portfolio — because AI risk doesn't respect policy boundaries."</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>— Sal Martorano, Founder</div>
          <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7 }}>This is not research. This is experience. We've spent years inside the institutions that create and transfer risk — and we apply that understanding to protect businesses navigating the AI coverage gap.</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ResearchSection() {
  const [expanded, setExpanded] = useState(null);
  const categories = [
    {
      title: "The January 2026 Exclusion Trigger",
      articles: [
        { title: "Verisk to Roll Out New General Liability Exclusions for Generative AI Exposures", source: "Independent Agent", date: "Oct 2025", url: "https://www.independentagent.com/vu_resource/verisk-to-roll-out-new-general-liability-exclusions-for-generative-ai-exposures/", summary: "Verisk's ISO Core Lines team developed new general liability endorsements — CG 40 47, CG 40 48, and CG 35 08 — effective January 2026, giving carriers the ability to exclude generative AI exposures from commercial general liability policies. Verisk reported strong carrier interest and expects rapid adoption." },
        { title: "New Generative AI Insurance Exclusions: What Businesses Need to Know in 2026", source: "PHL Firm", date: "Feb 2026", url: "https://phl-firm.com/generative-ai-insurance-exclusions-2026/", summary: "ISO forms underpin approximately 82% of U.S. Property & Casualty policies, meaning the new AI exclusions have the potential for rapid, widespread adoption. CG 40 47 broadly excludes both bodily injury/property damage and personal/advertising injury claims tied to generative AI. Small to mid-sized firms may be hit hardest." },
        { title: "Insurers, Brokers Adjust as AI Exclusions Emerge", source: "Business Insurance", date: "Apr 2026", url: "https://www.businessinsurance.com/insurers-brokers-adjust-as-ai-exclusions-emerge/", summary: "Industry leaders confirm carriers are beginning to adopt the January 2026 ISO exclusions. Gallagher's cyber practice notes the industry is in its earliest stages of determining where AI exposure should be covered. Multiple carriers are evaluating endorsements and policy language changes." },
        { title: "AI Update: The Growing Trend of AI-Related Insurance Policy Exclusions", source: "Zelle Law", date: "Oct 2025", url: "https://www.zellelaw.com/AI_Update_The_Growing_Trend_of_AI-Related_Insurance_Policy_Exclusions", summary: "Berkley introduced one of the broadest AI exclusions to date — an absolute exclusion eliminating coverage for any claim arising from the use, deployment, or development of AI across D&O, E&O, and Fiduciary Liability policies. Hamilton Insurance Group similarly excludes all claims involving generative AI from professional liability." },
        { title: "Insurers Draw Battle Lines on AI: New Policies Cover Hallucinations While Others Exclude AI", source: "AI:PRODUCTIVITY", date: "Mar 2026", url: "https://aiproductivity.ai/news/ai-liability-insurance-coverage-exclusions-2026/", summary: "The AI insurance market is splitting into two tracks: specialty carriers offering affirmative AI coverage, and traditional carriers using Verisk's new exclusions to remove AI risk entirely. Companies ignoring this shift will face a surprise when a claim gets denied under a newly-adopted exclusion." },
      ],
    },
    {
      title: "The Coverage Gap Problem",
      articles: [
        { title: "Smart Systems, Blind Spots: Rethinking Insurance for the AI Era", source: "Gallagher Re / MIT / Testudo", date: "Mar 2026", url: "https://riskandinsurance.com/traditional-insurance-leaves-enterprises-exposed-as-ai-liability-claims-surge/", summary: "Generative AI-related lawsuits in the U.S. grew 978% from 2021 to 2025, with over 700 cumulative filings. Cyber, tech E&O, product liability, and CGL policies each leave significant gaps. The report also flags accumulation risk: a single flaw in a widely-used model could trigger claims across thousands of policyholders." },
        { title: "AI Insurance Liability: New CGL Exclusions, Silent AI Coverage, and What Every Enterprise Should Know", source: "Swept AI", date: "Apr 2026", url: "https://www.swept.ai/post/ai-insurance-liability-cgl-exclusions-coverage-gaps", summary: "The transition from ambiguous AI coverage to explicit AI underwriting is underway. AIG, W.R. Berkley, and Great American have sought regulatory clearance for AI-specific exclusions. E&O carriers are scrutinizing AI-assisted professional services. Enterprises deploying third-party AI bear legal responsibility but vendor contracts limit indemnities." },
        { title: "Silent AI Insurance Crisis: SME Coverage Gaps in 2026", source: "TechLife Future", date: "Dec 2025", url: "https://www.techlifefuture.com/ai-insurance-exclusions-sme/", summary: "Small and medium enterprises face a critical inflection point as insurers move from silent AI coverage to explicit exclusions. Most SME owners assume their existing GL or BOP covers AI-related mishaps — but that assumption likely won't survive a 2026 renewal." },
        { title: "When Insurance Won't Cover AI: Why AI Governance Is Now Essential", source: "Lexology / Galkin Law", date: "Jan 2026", url: "https://www.lexology.com/library/detail.aspx?g=b76e0dba-d9a8-44f1-9f5d-6fbd0a22f6b6", summary: "Policies may now deny coverage for harm from flawed chatbot advice, generative AI content, decision-automation errors, or hallucinations. Where coverage isn't excluded, insurers are raising premiums, increasing deductibles, or capping AI-related limits." },
      ],
    },
    {
      title: "Market Size & Opportunity",
      articles: [
        { title: "AI Insurance Could Be a $4.8B Market by 2032", source: "Deloitte", date: "Aug 2025", url: "https://www.deloitte.com/us/en/insights/multimedia/videos/ai-insurance-market-potential.html", summary: "Deloitte projects AI-specific insurance premiums will grow at approximately 80% CAGR, reaching about $4.8 billion in annual global premiums by 2032. As AI becomes embedded in everyday life, liability and risk management questions are moving to center stage." },
        { title: "HSB Introduces AI Liability Insurance for Small Businesses", source: "Munich Re / HSB", date: "Mar 2026", url: "https://www.munichre.com/hsb/en/press-and-publications/press-releases/2026/2026-03-18-introducing-ai-liability-insurance-for-small-businesses.html", summary: "HSB launched a new AI liability product for small and medium-sized companies, filling gaps that some GL policies now exclude. An HSB survey of 1,000 businesses found that 91% plan to use AI, underscoring the urgency of the coverage gap." },
        { title: "How Insurance Policies Are Adapting To AI Risk", source: "Hunton Andrews Kurth", date: "2025", url: "https://www.hunton.com/insights/publications/how-insurance-policies-are-adapting-to-ai-risk", summary: "Approximately 72% of S&P 500 companies now discuss AI risks in annual securities filings. Munich Re's aiSure, Armilla AI, and Testudo have introduced standalone AI insurance products. The article recommends businesses conduct thorough audits to identify AI risks in the context of specific policy language." },
      ],
    },
    {
      title: "Where AI Insurance Is Headed",
      articles: [
        { title: "April 2026: Insurance AI Trends & Highlights", source: "Roots Automation", date: "Apr 2026", url: "https://www.roots.ai/blog/april-2026-insurance-ai-trends-highlights", summary: "An industry executive predicts a dedicated AI insurance sector could emerge within five to ten years — complete with its own MGAs, claims professionals, and policy forms — mirroring the trajectory of cyber insurance from a niche exposure in the 1990s to a major standalone line." },
        { title: "AI Roll-Out Is Outpacing Risk Controls, Gallagher Warns", source: "Insurance Business", date: "Apr 2026", url: "https://www.insurancebusinessmag.com/us/news/technology/ai-rollout-is-outpacing-risk-controls-gallagher-warns-569745.aspx", summary: "43% of firms lack formal AI risk frameworks and fewer than half conduct AI impact assessments, even as 47% now offer AI training and 40% have created AI-focused roles. The governance gap is feeding into more complex E&O, cyber, D&O, and employment practices exposures." },
        { title: "Gallagher Re Identifies Systemic Risk from AI Model Failures", source: "Insurance Business / Reinsurance", date: "Mar 2026", url: "https://www.insurancebusinessmag.com/reinsurance/news/breaking-news/gallagher-re-identifies-systemic-risk-from-ai-model-failures-569775.aspx", summary: "A critical flaw in one widely adopted AI model could trigger simultaneous claims across thousands of unrelated policyholders. Unlike traditional catastrophe events with geographic boundaries, AI failures propagate instantly across industries and borders." },
      ],
    },
  ];

  return (
    <Section bg={WHITE} id="research">
      <SectionLabel text="Industry Research" />
      <SectionTitle text="The Evidence Is Overwhelming." />
      <BodyText text="We've compiled the most important research, reports, and analysis from leading industry sources documenting the AI coverage crisis. Every claim we make is backed by data." maxWidth={650} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 32, marginBottom: 48 }}>
        {[
          { stat: "978%", label: "Growth in AI lawsuits (2021–2025)" },
          { stat: "82%", label: "Of U.S. P&C policies use ISO forms" },
          { stat: "$4.8B", label: "Projected AI premiums by 2032" },
          { stat: "91%", label: "Of businesses plan to use AI" },
        ].map((s, i) => (
          <div key={i} style={{ background: LIGHT, borderRadius: 12, padding: 24, textAlign: "center", border: "1px solid #E5E7EB" }}>
            <div style={{ color: NAVY, fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{s.stat}</div>
            <div style={{ color: GRAY, fontSize: 12, lineHeight: 1.4, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {categories.map((cat, catIdx) => (
        <div key={catIdx} style={{ marginBottom: 32 }}>
          <h3 style={{ color: NAVY, fontSize: 20, fontWeight: 700, margin: "0 0 16px", paddingBottom: 12, borderBottom: `2px solid ${LGOLD}` }}>{cat.title}</h3>
          {cat.articles.map((article, artIdx) => {
            const key = `${catIdx}-${artIdx}`;
            const isOpen = expanded === key;
            return (
              <div key={artIdx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <button onClick={() => setExpanded(isOpen ? null : key)} style={{
                  width: "100%", textAlign: "left", padding: "20px 0", background: "none", border: "none",
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, fontFamily: "inherit",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: NAVY, fontSize: 16, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{article.title}</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ color: GOLD, fontSize: 13, fontWeight: 600 }}>{article.source}</span>
                      <span style={{ color: GRAY, fontSize: 12 }}>{article.date}</span>
                    </div>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", border: "1px solid #E5E7EB",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4,
                    transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}>
                    <span style={{ fontSize: 12, color: GRAY }}>▼</span>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ paddingBottom: 20 }}>
                    <p style={{ color: DGRAY, fontSize: 15, lineHeight: 1.8, margin: "0 0 16px", paddingLeft: 16, borderLeft: `3px solid ${GOLD}` }}>{article.summary}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600,
                      color: GOLD, textDecoration: "none", padding: "8px 16px", border: `1px solid ${GOLD}`, borderRadius: 6,
                    }}>Read Original Source →</a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: 40, borderTop: "1px solid #E5E7EB", paddingTop: 24 }}>
        <div style={{ color: GRAY, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Sources & Citations</div>
        <ol style={{ margin: 0, padding: "0 0 0 20px", fontSize: 12, lineHeight: 2.2, color: GRAY }}>
          {categories.flatMap(c => c.articles).map((a, i) => (
            <li key={i}>"{a.title}" — <em>{a.source}</em>, {a.date}. <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: "none" }}>{a.url.length > 70 ? a.url.substring(0, 67) + "..." : a.url}</a></li>
          ))}
        </ol>
        <p style={{ color: GRAY, fontSize: 11, marginTop: 16, fontStyle: "italic" }}>All summaries written by The AI Insurance Group based on publicly available sources. We encourage readers to review the original publications for complete context. Last updated: April 2026.</p>
      </div>
    </Section>
  );
}

function CTASection() {
  return (
    <section style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 100%)`, padding: "80px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ color: WHITE, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: -0.5 }}>Don't Wait for a Denied Claim<br />to Find Out You're Exposed.</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.7, margin: "0 0 36px" }}>Take our free 60-second assessment. Find out if your business has AI-related coverage gaps — before your next renewal.</p>
        <a href="https://isyouraicovered.com?new=1" style={{ display: "inline-block", background: GOLD, color: WHITE, borderRadius: 8, padding: "20px 48px", fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 24px rgba(184,151,42,0.3)", letterSpacing: 0.3 }}>Check My Coverage — Free →</a>
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
                style={{ width: "100%", padding: "16px", borderRadius: 8, border: "none", background: NAVY, color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer", boxSizing: "border-box" }}>Submit Request →</button>
              <p style={{ color: GRAY, fontSize: 12, marginTop: 8, textAlign: "center" }}>Your information is confidential. We respond within 24 hours.</p>
              <p style={{ color: GRAY, fontSize: 10, marginTop: 4, textAlign: "center", lineHeight: 1.5 }}>We do not sell or bind insurance. Coverage is provided through licensed insurance professionals.</p>
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
              <div style={{ width: 32, height: 32, borderRadius: 6, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: WHITE, fontSize: 12 }}>AIG</div>
              <span style={{ color: WHITE, fontWeight: 700, fontSize: 15 }}>The AI Insurance <span style={{ color: GOLD }}>Group</span></span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6, maxWidth: 300 }}>Specialized AI liability coverage and risk advisory. Helping businesses navigate the 2026 AI insurance exclusion landscape.</p>
          </div>
          <div>
            <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>RESOURCES</div>
            {["Free AI Coverage Assessment", "Industry Research", "AI Exclusion Knowledge Base", "Healthcare AI Risk", "Wealth Management AI Risk", "Broker Partnership Program"].map((l, i) => (
              <div key={i} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l === "Industry Research" ? <a href="#research" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{l}</a> : l}</div>
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
            © 2026 The AI Insurance Group. All rights reserved. The AI Insurance Group is a marketing and informational platform. Insurance coverage is provided through licensed insurance brokers. All policies are written and serviced by a licensed insurance agency.
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
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", margin: 0, padding: 0 }}>
      <Nav />
      <Hero />
      <ProblemSection />
      <ServicesSection />
      <IndustriesSection />
      <ProcessSection />
      <AboutSection />
      <ResearchSection />
      <CTASection />
      <ContactSection />
      <Footer onLegalPage={setLegalPage} />
    </div>
  );
}
