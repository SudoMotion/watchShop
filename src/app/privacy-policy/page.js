import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// Privacy Policy data
const privacyPolicyData = {
  title: "Privacy Policy For Watch Shop BD",
  image: "/images/2.jpg",
  content: {
    intro: "At Watch Shop BD, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and protect your information when you visit our website and make purchases. By using our services, you agree to the collection and use of information in accordance with this policy. We encourage you to read this policy carefully to understand our practices regarding your personal data and how we will treat it.",
    sections: [
      {
        heading: "Information Collection",
        paragraphs: [
          "We collect various types of personal information to provide you with the best shopping experience and customer service. **Personal information** we collect may include your name, address, email address, phone number, payment information, browsing behavior, and more.",
          "When you create an account, place an order, subscribe to our newsletter, or contact our customer service, we collect information that you provide directly to us. We also automatically collect certain information when you visit our website, such as your IP address, browser type, device information, and pages you view, to help us understand how you use our site and improve your experience."
        ]
      },
      {
        heading: "Payment Processing",
        paragraphs: [
          "Your financial security is of utmost importance to us. We process payments through **secure payment gateways** that use industry-standard encryption methods to protect your payment information. We work with trusted third-party payment processors to handle your transactions securely.",
          "We do not store your complete credit card or payment information on our servers. All payment data is encrypted and transmitted securely using SSL (Secure Socket Layer) technology. Our payment processors comply with PCI DSS (Payment Card Industry Data Security Standard) requirements to ensure the highest level of security for your financial information."
        ]
      },
      {
        heading: "Data Usage",
        paragraphs: [
          "We use the information we collect for several purposes to enhance your shopping experience and provide our services effectively. This includes **processing your orders**, managing your account, personalizing your shopping experience, providing customer support, and sending promotional offers when you have opted in to receive them.",
          "We also use your information to communicate with you about your orders, respond to your inquiries, send you important updates about our services, and analyze website usage to improve our platform. Your data helps us understand customer preferences and trends, allowing us to offer better products and services tailored to your interests."
        ]
      },
      {
        heading: "Sharing with Third Parties",
        paragraphs: [
          "We may share your information with trusted third parties to provide services on our behalf, including **shipping companies**, marketing partners, and service providers. These third parties are authorized to use your personal information only as necessary to provide services to us and are required to maintain the confidentiality of your information.",
          "We do not sell your personal information to third parties. However, we may share aggregated, non-personally identifiable information with partners for business purposes. You have the option to opt out of certain data sharing activities, and we respect your privacy preferences. We only share information when necessary and ensure that our partners maintain appropriate security measures."
        ]
      },
      {
        heading: "Data Security",
        paragraphs: [
          "We implement **comprehensive security measures** to protect your personal and financial information from unauthorized access, misuse, or loss. Our security measures include encryption, firewalls, regular security audits, and compliance with industry standards.",
          "We use SSL encryption to protect data transmission, maintain secure servers with restricted access, and regularly update our security protocols to address emerging threats. While no method of transmission over the internet or electronic storage is 100% secure, we strive to use commercially acceptable means to protect your personal information and continuously work to improve our security practices."
        ]
      },
      {
        heading: "Cookies and Tracking",
        paragraphs: [
          "Our website uses **cookies and other tracking technologies** to collect data about your browsing behavior and enhance your experience. Cookies help us remember your preferences, understand how you interact with our site, and provide personalized content and advertisements.",
          "You can manage your cookie preferences through your browser settings and opt out of certain tracking activities. However, please note that disabling cookies may affect the functionality of our website and your ability to access certain features. We use cookies for essential website functions, analytics, and marketing purposes, and we provide you with choices about how your data is used."
        ]
      },
      {
        heading: "User Accounts",
        paragraphs: [
          "If you create a user account with us, we store your account information securely and use it to manage your orders, preferences, and shopping history. **Account information** includes your login credentials, shipping addresses, order history, and preferences.",
          "You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. We recommend using a strong, unique password and not sharing your account credentials with others. You can update your account information at any time through your account dashboard, and we provide secure options to manage your account settings and preferences."
        ]
      },
      {
        heading: "Data Retention",
        paragraphs: [
          "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. **Retention periods** vary depending on the type of information and the purpose for which it was collected.",
          "You have the option to request deletion of your data, subject to legal and operational requirements. We will delete your personal information when it is no longer needed for the purposes for which it was collected, unless we are required to retain it for legal, regulatory, or business purposes. If you wish to delete your account or request data deletion, please contact our customer service team."
        ]
      },
      {
        heading: "Legal Compliance",
        paragraphs: [
          "We are committed to complying with relevant **privacy laws and regulations**, including the GDPR (General Data Protection Regulation) in Europe, the CCPA (California Consumer Privacy Act) in the United States, and applicable data protection laws in Bangladesh.",
          "We respect your rights regarding your personal information, including the right to access, correct, delete, or restrict the processing of your data. If you have questions about your privacy rights or wish to exercise them, please contact us. We will respond to your requests in accordance with applicable privacy laws and within the required timeframes."
        ]
      },
      {
        heading: "Updates and Notifications",
        paragraphs: [
          "We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. When we make changes, we will notify users through **email notifications**, website alerts, or other channels as appropriate.",
          "The updated policy will indicate the date of the last revision and will take effect immediately upon posting. We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your information. Your continued use of our services after any changes constitutes your acceptance of the revised Privacy Policy."
        ]
      }
    ]
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

        {/* Main Image */}
        <div className="relative w-full h-64 md:h-80 mb-8 bg-gray-100 overflow-hidden">
          <Image
            src={privacyPolicyData.image}
            alt={privacyPolicyData.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {privacyPolicyData.title}
        </h1>

        {/* Introductory Paragraph */}
        <p className="text-gray-900 mb-8 leading-relaxed text-base md:text-lg">
          {privacyPolicyData.content.intro}
        </p>

        {/* Content Sections */}
        <div className="space-y-8">
          {privacyPolicyData.content.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-900 leading-relaxed">
                    {paragraph.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        const text = part.slice(2, -2);
                        return <strong key={partIndex}>{text}</strong>;
                      }
                      return <span key={partIndex}>{part}</span>;
                    })}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

