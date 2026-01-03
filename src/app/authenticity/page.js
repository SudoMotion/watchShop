import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// Mock authenticity data
const authenticityData = {
  title: "Product Authenticity & Guarantee",
  image: "/images/2.jpg",
  content: {
    intro: "At Watch Shop BD, we understand that authenticity is paramount when purchasing luxury timepieces. Our commitment to providing genuine, certified watches is the foundation of our business. Every watch we sell undergoes rigorous authentication processes to ensure you receive only authentic products from authorized dealers and trusted suppliers. We stand behind every timepiece with comprehensive warranties and authenticity guarantees, giving you complete confidence in your purchase.",
    sections: [
      {
        heading: "Our Authentication Process",
        paragraphs: [
          "Every watch in our inventory goes through a **comprehensive authentication process** before it reaches our customers. Our team of certified watch experts examines each timepiece for authenticity markers, including serial numbers, movement verification, case engravings, and manufacturer-specific details. We verify the origin of each watch and maintain detailed records of its certification and provenance.",
          "We work exclusively with **authorized dealers and trusted suppliers** who have established relationships with watch manufacturers. This ensures that every watch we offer comes with proper documentation, including certificates of authenticity, warranty cards, and original packaging. Our strict supplier vetting process eliminates the risk of counterfeit or modified timepieces entering our inventory."
        ]
      },
      {
        heading: "Certification & Documentation",
        paragraphs: [
          "All watches purchased from Watch Shop BD come with **complete documentation** to prove their authenticity. This includes manufacturer warranty cards, certificates of authenticity, original boxes, instruction manuals, and all accompanying materials. For luxury brands, we provide additional verification through official brand authentication services when available.",
          "We maintain a **comprehensive database** of all watches sold, including serial numbers, purchase dates, and customer information. This documentation is crucial for warranty claims, service requests, and future resale value. Our records also serve as proof of authenticity should you ever need to verify your watch's legitimacy."
        ]
      },
      {
        heading: "Warranty & Guarantee",
        paragraphs: [
          "Every authentic watch from Watch Shop BD comes with a **manufacturer's warranty** that covers defects in materials and workmanship. The warranty period varies by brand and model but typically ranges from 2 to 5 years. In addition to the manufacturer warranty, we offer our own guarantee that every watch we sell is 100% authentic and as described.",
          "Our **authenticity guarantee** means that if any watch sold by us is determined to be non-authentic by the manufacturer or an authorized service center, we will provide a full refund and cover all related expenses. This guarantee extends for the lifetime of your ownership, demonstrating our unwavering commitment to authenticity and customer satisfaction."
        ]
      },
      {
        heading: "Identifying Authentic Watches",
        paragraphs: [
          "Understanding how to identify authentic watches is crucial for any watch enthusiast. **Key authenticity markers** include precise engravings, quality of finish, movement accuracy, and manufacturer-specific details. Serial numbers should match across all components, and the movement should bear the manufacturer's markings and meet their quality standards.",
          "We provide **educational resources** to help our customers recognize authentic timepieces. Our staff is trained to explain the unique features and characteristics of each brand, helping you understand what makes a watch genuine. We believe that informed customers make better purchasing decisions and can better appreciate the craftsmanship of authentic luxury watches."
        ]
      },
      {
        heading: "Protecting Against Counterfeits",
        paragraphs: [
          "The watch industry faces ongoing challenges from **counterfeit manufacturers** who attempt to replicate luxury timepieces. Watch Shop BD employs multiple layers of protection against counterfeits, including supplier verification, product inspection, and continuous monitoring of industry trends. We stay informed about the latest counterfeiting techniques and update our authentication processes accordingly.",
          "We encourage customers to **verify their purchases** through official brand service centers if they have any concerns about authenticity. Most major watch manufacturers offer authentication services, and we fully support and assist with any verification process our customers wish to undertake. Our transparency and willingness to participate in verification demonstrate our confidence in the authenticity of our products."
        ]
      },
      {
        heading: "Return Policy & Satisfaction",
        paragraphs: [
          "Your satisfaction and confidence in your purchase are our top priorities. We offer a **comprehensive return policy** that allows you to inspect your watch upon delivery. If you have any concerns about authenticity or condition, you can return the watch within the specified return period for a full refund. We understand that purchasing a luxury watch is a significant investment, and we want you to feel completely confident in your purchase.",
          "Our **customer service team** is available to answer any questions about authenticity, warranties, or verification processes. We're committed to transparency and will provide all information you need to make an informed purchase decision. Your trust is earned through our actions, and we work hard every day to maintain that trust through authentic products and exceptional service."
        ]
      },
      {
        heading: "Our Commitment to You",
        paragraphs: [
          "Watch Shop BD's commitment to authenticity is not just a business practice—it's a **core value** that guides everything we do. We understand that when you purchase a luxury watch, you're investing in craftsmanship, heritage, and quality. We honor that investment by ensuring every watch we sell meets the highest standards of authenticity and quality.",
          "As the **number one retail watch business company in Bangladesh**, we recognize our responsibility to set the standard for authenticity and customer service in the industry. We pledge to continue our rigorous authentication processes, maintain our relationships with authorized dealers, and provide the documentation and guarantees that give you complete confidence in your purchase. Your trust is our most valuable asset, and we protect it by protecting the authenticity of every watch we sell."
        ]
      }
    ]
  }
};

export default function AuthenticityPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Authenticity</span>
        </nav>

        {/* Main Image */}
        <div className="relative w-full h-64 md:h-80 mb-8 bg-gray-100 overflow-hidden">
          <Image
            src={authenticityData.image}
            alt={authenticityData.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {authenticityData.title}
        </h1>

        {/* Introductory Paragraph */}
        <p className="text-gray-900 mb-8 leading-relaxed text-base md:text-lg">
          {authenticityData.content.intro}
        </p>

        {/* Content Sections */}
        <div className="space-y-8">
          {authenticityData.content.sections.map((section, index) => (
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

