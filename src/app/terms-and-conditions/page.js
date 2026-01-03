import Link from 'next/link';
import React from 'react';

// Terms and Conditions data
const termsAndConditionsData = {
  title: "TERMS AND CONDITIONS OF WATCH SHOP BD",
  subtitle: "Terms and Conditions of Watch Shop BD",
  content: {
    intro: "Welcome to Watch Shop BD, your trusted destination for high-quality timepieces. To ensure a smooth and transparent shopping experience, we ask that you review our Terms and Conditions. By accessing and using our website, you agree to abide by these terms, which outline the rights and responsibilities of both parties.",
    sections: [
      {
        heading: "Acceptance of Terms",
        paragraphs: [
          "By using our website, you agree to comply with these Terms and Conditions, along with our Privacy Policy. If you do not agree with any part of these terms, please refrain from using our site."
        ]
      },
      {
        heading: "Product Information and Pricing",
        paragraphs: [
          "We strive to provide accurate and up-to-date information about our products. However, there may be instances where errors or inaccuracies occur, including pricing errors. We reserve the right to correct any such errors and to update product information as needed. Prices and availability are subject to change without prior notice."
        ]
      },
      {
        heading: "Orders and Payment",
        paragraphs: [
          "When you place an order on our website, you agree to provide accurate and complete information. Upon receipt of your order, we will send you a confirmation email outlining the details. Payment must be made in full before shipment. We accept various payment methods, including credit/debit cards and online payment systems. Please ensure that your payment information is accurate and up-to-date to avoid delays."
        ]
      },
      {
        heading: "Shipping and Delivery",
        paragraphs: [
          "We offer shipping services to various locations. Delivery times may vary based on your location and the shipping method selected. While we strive to process and ship orders promptly, we are not responsible for delays caused by external factors such as customs processing or carrier issues. Shipping fees are calculated based on the delivery location and will be displayed at checkout."
        ]
      },
      {
        heading: "Returns and Exchanges",
        paragraphs: [
          "We want you to be satisfied with your purchase. If you need to return or exchange a product, please contact our customer service team within [number] days of receiving your order. Items must be returned in their original condition, including packaging, and any applicable warranties. Please note that some products may be non-returnable due to hygiene or other considerations. Refunds will be processed to the original payment method once the returned item is received and inspected."
        ]
      },
      {
        heading: "Intellectual Property",
        paragraphs: [
          "All content on our website, including images, text, and logos, is the intellectual property of Watch Shop BD and may not be used or reproduced without permission."
        ]
      },
      {
        heading: "Limitation of Liability",
        paragraphs: [
          "We are not liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability is limited to the amount paid for the product in question."
        ]
      },
      {
        heading: "Changes to Terms",
        paragraphs: [
          "We may update these Terms and Conditions periodically. Any changes will be posted on our website, and your continued use of the site constitutes acceptance of the revised terms."
        ]
      }
    ],
    conclusion: "For any questions or concerns regarding these Terms and Conditions, please contact our customer support team. Thank you for choosing Watch Shop BD. We look forward to serving you."
  }
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Terms and Conditions</span>
        </nav>

        {/* Main Title - Centered, Uppercase, Large, Bold */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
          {termsAndConditionsData.title}
        </h1>

        {/* Subtitle - Left-aligned, Bold */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {termsAndConditionsData.subtitle}
        </h2>

        {/* Introductory Paragraph */}
        <p className="text-gray-900 mb-8 leading-relaxed text-base md:text-lg">
          {termsAndConditionsData.content.intro}
        </p>

        {/* Content Sections - Numbered List */}
        <div className="space-y-6">
          {termsAndConditionsData.content.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                {index + 1}. {section.heading}
              </h3>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-900 leading-relaxed text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <p className="text-gray-900 mt-8 leading-relaxed text-base md:text-lg">
          {termsAndConditionsData.content.conclusion}
        </p>
      </div>
    </div>
  );
}

