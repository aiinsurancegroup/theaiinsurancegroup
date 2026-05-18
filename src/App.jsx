import { useState, useEffect } from "react";

const NAVY = "#1A2B45";
const GOLD = "#B8972A";
const DARK = "#0F1923";
const WHITE = "#FFFFFF";
const LIGHT = "#F7F8FA";
const LGOLD = "#F5EFE0";
const GRAY = "#6B7280";
const DGRAY = "#374151";
const RED = "#DC2626";

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
            <div style={{ width: 36, height: 36, borderRadius: 8, background: WHITE, border: "1.5px solid " + NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, letterSpacing: -0.3, fontFamily: "Arial, sans-serif" }}>
              <span style={{ color: GOLD }}>AI</span>
              <span style={{ color: GOLD, margin: "0 1px" }}>·</span>
              <span style={{ color: NAVY }}>IG</span>
            </div>
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
      <LegalP>The AI Insurance Group is an informational and marketing platform. Insurance products referenced on our Sites are sold through Alexander Capital Insurance Agency, a licensed agency. Coverage availability, terms, and pricing are determined by the issuing insurance carriers and are subject to underwriting approval.</LegalP>

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
      <LegalP>The AI Insurance Group is an informational and marketing platform focused on AI-related insurance risks and coverage solutions. The AI Insurance Group educates the market on AI liability exposures, identifies potential coverage gaps in existing policies, and connects users with licensed insurance professionals.</LegalP>

      <LegalH2>Insurance Sales and Licensed Agency</LegalH2>
      <LegalP>All insurance products referenced on theaiinsurancegroup.com and isyouraicovered.com are sold through Alexander Capital Insurance Agency, a licensed agency. Sal Martorano is a licensed Property & Casualty insurance producer in New Jersey and Florida and produces insurance business through Alexander Capital Insurance Agency.</LegalP>
      <LegalP>Coverage availability, terms, conditions, limits, and pricing are determined by the issuing insurance carriers and are subject to underwriting review and approval. Not all coverage options are available in all states.</LegalP>

      <LegalH2>Insurance Products and Coverage</LegalH2>
      <LegalP>All policies are written, issued, and serviced by licensed insurance carriers through Alexander Capital Insurance Agency. The AI Insurance Group itself does not bind, issue, or service insurance policies.</LegalP>

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
      <LegalP>FINRA Series 7, 24, 55, 63, and 99 licenses referenced on our Sites are held by Sal
