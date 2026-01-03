import Link from 'next/link';
import React from 'react';

// Privacy Policy data
const privacyPolicyData = {
  title: "PRIVACY POLICY FOR WATCH SHOP BD",
  content: {
    sections: [
      {
        heading: "Information Collection:",
        text: "Understand what personal information the e-commerce site collects from you. This may include your name, address, email, phone number, payment information, browsing behavior, and more."
      },
      {
        heading: "Payment Processing:",
        text: "Learn how the site processes payments and handles your financial information. Look for details on encryption methods, secure payment gateways, and any third-party payment processors involved."
      },
      {
        heading: "Data Usage:",
        text: "Determine how the site uses the information it collects from you. This could include processing orders, personalizing your shopping experience, providing customer support, and sending promotional offers."
      },
      {
        heading: "Sharing with Third Parties:",
        text: "Check whether the site shares your information with third parties, such as shipping companies, marketing partners, or service providers. Understand the purposes for which your data may be shared and whether you have the option to opt out."
      },
      {
        heading: "Data Security:",
        text: "Assess the measures the site takes to protect your personal and financial information from unauthorized access, misuse, or loss. Look for statements about encryption, firewalls, regular security audits, and compliance with industry standards."
      },
      {
        heading: "Cookies and Tracking:",
        text: "Understand how the site uses cookies and other tracking technologies to collect data about your browsing behavior. Learn how you can manage your cookie preferences and opt out of certain tracking activities."
      },
      {
        heading: "User Accounts:",
        text: "If the site offers user accounts, review the policies regarding account creation, login credentials, and account management. Understand how your account information is stored and protected."
      },
      {
        heading: "Data Retention:",
        text: "Learn how long the site retains your personal information and the criteria used to determine retention periods. Determine whether you have the option to request deletion of your data."
      },
      {
        heading: "Legal Compliance:",
        text: "Ensure that the site complies with relevant privacy laws and regulations, such as the GDPR (General Data Protection Regulation) in Europe or the CCPA (California Consumer Privacy Act) in the United States."
      },
      {
        heading: "Updates and Notifications:",
        text: "Check how the site notifies users about changes to the privacy policy and when those changes take effect. Determine whether you'll receive notifications via email, website alerts, or other channels."
      }
    ],
    conclusion: "By carefully reviewing these aspects of an e-commerce site's privacy policy, you can better understand how your personal information is handled and make informed decisions about your online shopping activities."
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>

        {/* Main Title - Centered, Uppercase, Large, Bold */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-10 uppercase tracking-tight">
          {privacyPolicyData.title}
        </h1>

        {/* Content Sections - Numbered List */}
        <div className="space-y-5">
          {privacyPolicyData.content.sections.map((section, index) => (
            <div key={index} className="mb-5">
              <p className="text-gray-900 leading-relaxed text-base md:text-lg">
                <span className="font-bold">{index + 1}. {section.heading}</span> {section.text}
              </p>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <p className="text-gray-900 mt-8 leading-relaxed text-base md:text-lg">
          {privacyPolicyData.content.conclusion}
        </p>
      </div>
    </div>
  );
}

