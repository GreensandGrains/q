import { Shield, FileText, Cookie, Flag, Server, Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type PolicyType = "privacy" | "terms" | "security" | "cookies" | "dmca" | "sla";

const policies: Record<PolicyType, { title: string; icon: React.ReactNode; updated: string; sections: { heading: string; content: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    icon: <Lock className="w-6 h-6 text-primary" />,
    updated: "January 1, 2025",
    sections: [
      { heading: "1. Information We Collect", content: "We collect information you provide directly to us, such as your name, email address, and payment information when you register for an account. We also collect information automatically when you use our services, including log data, device information, and usage statistics." },
      { heading: "2. How We Use Your Information", content: "We use the information we collect to provide, maintain, and improve our services; process transactions; send you technical notices and support messages; respond to your comments and questions; and send you marketing communications (with your consent)." },
      { heading: "3. Information Sharing", content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, so long as those parties agree to keep this information confidential." },
      { heading: "4. Data Retention", content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy. Account information is retained for the duration of your account, plus 90 days after account deletion to facilitate dispute resolution." },
      { heading: "5. Security", content: "We implement industry-standard security measures including SSL/TLS encryption, two-factor authentication options, regular security audits, and SOC 2 compliant data centers." },
      { heading: "6. Your Rights", content: "You have the right to access, correct, or delete your personal data. You may request a copy of your data, opt out of marketing communications at any time, and request deletion of your account." },
      { heading: "7. Contact Us", content: "If you have questions about this Privacy Policy, please contact our Data Protection Officer at privacy@nexaro.cloud." },
    ],
  },
  terms: {
    title: "Terms of Service",
    icon: <FileText className="w-6 h-6 text-primary" />,
    updated: "January 1, 2025",
    sections: [
      { heading: "1. Acceptance of Terms", content: "By accessing or using Nexaro Cloud services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services." },
      { heading: "2. Account Registration", content: "To use certain features of our service, you must register for an account. You must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activity that occurs under your account." },
      { heading: "3. Acceptable Use Policy", content: "You may not use our services to: host or transmit illegal content; engage in spamming or phishing; conduct DDoS attacks or network abuse; mine cryptocurrency without written consent; store or distribute malware; or infringe on intellectual property rights." },
      { heading: "4. Service Availability and SLA", content: "We strive to provide 99.9% uptime as outlined in our Service Level Agreement. Scheduled maintenance windows will be announced at least 48 hours in advance." },
      { heading: "5. Payment and Billing", content: "Services are billed monthly or annually in advance. All fees are non-refundable except as expressly set forth herein. Price changes will be communicated at least 30 days in advance." },
      { heading: "6. Termination", content: "We may terminate or suspend your account immediately, without prior notice, for conduct that violates these Terms. All data will be retained for 30 days post-termination, then permanently deleted." },
      { heading: "7. Limitation of Liability", content: "To the maximum extent permitted by applicable law, Nexaro Cloud shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid in the 12 months preceding the claim." },
    ],
  },
  security: {
    title: "Security Policy",
    icon: <Shield className="w-6 h-6 text-primary" />,
    updated: "January 1, 2025",
    sections: [
      { heading: "1. Our Security Commitment", content: "Security is at the core of everything we build at Nexaro Cloud. We maintain a comprehensive security program that includes physical, network, application, and operational security." },
      { heading: "2. Infrastructure Security", content: "Our data centers are SOC 2 Type II certified and feature 24/7 physical security, biometric access controls, redundant power systems, and climate control. All network traffic is encrypted using TLS 1.3." },
      { heading: "3. Data Encryption", content: "All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. Database backups are encrypted independently. Encryption keys are managed using hardware security modules (HSMs)." },
      { heading: "4. Access Controls", content: "We enforce strict access controls using the principle of least privilege. All administrative access requires multi-factor authentication. Access to production systems is logged, monitored, and reviewed quarterly." },
      { heading: "5. Vulnerability Management", content: "We conduct regular penetration testing by independent third parties. Our bug bounty program rewards security researchers for responsibly disclosing vulnerabilities. We patch critical vulnerabilities within 24 hours." },
      { heading: "6. Incident Response", content: "We maintain a formal incident response plan tested quarterly. In the event of a security incident, we will notify affected customers within 72 hours of discovery, as required by GDPR." },
      { heading: "7. Responsible Disclosure", content: "If you discover a security vulnerability, please report it to security@nexaro.cloud. We will acknowledge receipt within 24 hours. We ask for 90 days to address vulnerabilities before public disclosure." },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    icon: <Cookie className="w-6 h-6 text-primary" />,
    updated: "January 1, 2025",
    sections: [
      { heading: "1. What Are Cookies", content: "Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences and understanding how you use our site." },
      { heading: "2. Essential Cookies", content: "These cookies are strictly necessary for the website to function and cannot be switched off. They include session management cookies, security cookies, and cookies that remember your cookie consent choices." },
      { heading: "3. Performance Cookies", content: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information these cookies collect is aggregated and anonymous." },
      { heading: "4. Functional Cookies", content: "These cookies allow the website to provide enhanced functionality and personalization. If you disable these cookies, some of these services may not function properly." },
      { heading: "5. Analytics Cookies", content: "We use analytics cookies to understand how visitors interact with our website. Analytics data is processed in aggregate form and does not identify individual users." },
      { heading: "6. Managing Cookies", content: "You can control and delete cookies through your browser settings. Deleting cookies may affect your experience and you may need to re-enter your login credentials." },
    ],
  },
  dmca: {
    title: "DMCA Policy",
    icon: <Flag className="w-6 h-6 text-primary" />,
    updated: "January 1, 2025",
    sections: [
      { heading: "1. DMCA Compliance", content: "Nexaro Cloud complies with the Digital Millennium Copyright Act (DMCA) and responds promptly to claims of copyright infringement. We take intellectual property rights seriously." },
      { heading: "2. Filing a DMCA Notice", content: "To file a takedown notice, provide: (1) a signature of the copyright owner; (2) identification of the copyrighted work; (3) identification of the infringing material; (4) your contact information; (5) a good faith belief statement; and (6) a statement of accuracy." },
      { heading: "3. Counter-Notification", content: "If you believe your content was removed in error, you may submit a counter-notification including your signature, identification of the removed content, a statement under penalty of perjury, and your contact information." },
      { heading: "4. Repeat Infringers", content: "Nexaro Cloud has a policy of terminating accounts of users who repeatedly infringe copyright. Three documented DMCA violations will result in permanent account termination." },
      { heading: "5. Contact for DMCA Notices", content: "Send DMCA notices to: dmca@nexaro.cloud or by mail to Nexaro Cloud Ltd., DMCA Agent, 123 Cloud Tower, San Francisco, CA 94105. We aim to respond within 24 business hours." },
    ],
  },
  sla: {
    title: "Service Level Agreement",
    icon: <Server className="w-6 h-6 text-primary" />,
    updated: "January 1, 2025",
    sections: [
      { heading: "1. Uptime Commitment", content: "Nexaro Cloud commits to: Starter: 99.9%; Pro: 99.97%; Business: 99.99%; Enterprise: 99.999% monthly uptime. Uptime is calculated as (total minutes - downtime minutes) / total minutes × 100." },
      { heading: "2. Service Credits", content: "If we fail to meet our uptime commitment: 99.0%–99.9% = 10% credit; 95.0%–99.0% = 25% credit; below 95.0% = 50% credit. Credits are applied to your next invoice." },
      { heading: "3. Exclusions", content: "SLA commitments do not apply to: scheduled maintenance; force majeure events; your actions or third-party services; denial of service attacks until mitigated; or your failure to follow our documentation." },
      { heading: "4. Scheduled Maintenance", content: "We provide at least 48 hours advance notice for scheduled maintenance. Windows are typically 02:00–06:00 UTC on weekdays. Emergency maintenance may have shorter notice." },
      { heading: "5. Support Response Times", content: "Starter: 24 hours (email); Pro: 12 hours (email + priority queue); Business: 4 hours (email + phone); Enterprise: 1 hour (dedicated account manager + 24/7 phone)." },
      { heading: "6. Claiming Credits", content: "Submit credit requests to support@nexaro.cloud within 30 days of the incident. Include your account ID, dates and times of downtime, and a description. We respond within 5 business days." },
    ],
  },
};

export default function PolicyPage({ type }: { type: PolicyType }) {
  const policy = policies[type];
  if (!policy) return null;

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="fixed top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            {policy.icon} Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{policy.title}</h1>
          <p className="text-gray-500 text-sm">Last updated: {policy.updated}</p>
        </div>

        <div className="rounded-2xl bg-[#0D0D14]/80 backdrop-blur-xl border border-white/10 p-8 space-y-8">
          {policy.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-white font-bold text-lg mb-3">{section.heading}</h2>
              <p className="text-gray-400 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-white/[0.03] border border-white/10 p-6">
          <p className="text-gray-500 text-sm mb-4 uppercase tracking-widest font-semibold">Other Legal Documents</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(policies) as PolicyType[]).filter((k) => k !== type).map((k) => (
              <Link key={k} href={`/${k}`}>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary border border-white/10 hover:border-primary/30 text-xs uppercase tracking-wider">
                  {policies[k].title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
