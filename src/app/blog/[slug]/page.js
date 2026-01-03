import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// All blog post slugs - must match the blog listing page
const blogPostSlugs = [
  'solar-powered-watches',
  'citizen-watch-legacy',
  'automatic-watches',
  'top-10-luxury-watches-2025',
  'seiko-watches',
  'tissot-prx-powermatic-80'
];

// Mock blog data - in a real app, this would come from a CMS or database
const blogPosts = {
  'citizen-watch-legacy': {
    title: "Timeless Innovation: The Legacy and Future of Citizen Watch",
    image: "/images/2.jpg",
    content: {
      intro: "When it comes to wristwatches that balance cutting-edge technology with timeless design, Citizen stands out as a true pioneer. For over a century, Citizen Watch Co., Ltd. has been at the forefront of horological innovation, creating timepieces that combine precision engineering with elegant aesthetics. From the development of Eco-Drive technology to the introduction of satellite-synced timekeeping, Citizen has consistently pushed the boundaries of what a watch can do while maintaining an unwavering commitment to environmental responsibility.",
      sections: [
        {
          heading: "A Legacy That Spans Generations",
          paragraphs: [
            "Founded in 1918, Citizen began with a simple yet ambitious mission: to make high-quality watches accessible to everyone. What started as a small watchmaker in Tokyo has grown into one of the world's most respected and innovative watch brands. Over the decades, Citizen has built a reputation for reliability, innovation, and value, earning the trust of millions of watch enthusiasts worldwide.",
            "The brand's name, 'Citizen,' reflects its founding philosophy of creating timepieces for all citizens of the world. This inclusive approach has guided Citizen's development, resulting in watches that appeal to diverse audiences—from professional divers and pilots to everyday users seeking reliable, stylish timepieces."
          ]
        },
        {
          heading: "Eco-Drive: Powering the Future",
          paragraphs: [
            "Perhaps Citizen's most revolutionary contribution to watchmaking is **Eco-Drive technology**. Introduced in 1995, Eco-Drive harnesses the power of light—whether from the sun, indoor lighting, or any light source—to keep watches running indefinitely. This breakthrough eliminated the need for battery replacements, making Citizen watches not only more convenient but also more environmentally friendly.",
            "**Eco-Drive technology** represents a perfect marriage of innovation and sustainability. By converting any light source into energy stored in a rechargeable cell, these watches can run for months in complete darkness after being fully charged. This technology has been refined over the years, becoming more efficient and capable of powering increasingly complex movements, from simple three-hand watches to sophisticated chronographs and world time models."
          ]
        },
        {
          heading: "The Art of Innovation",
          paragraphs: [
            "Beyond Eco-Drive, Citizen has introduced numerous technological innovations that have shaped modern watchmaking. **Radio-Controlled Timekeeping** allows watches to automatically sync with atomic clock signals, ensuring absolute precision. This technology ensures that your Citizen watch is always accurate to within one second, automatically adjusting for daylight saving time and time zone changes.",
            "**Satellite Wave GPS** represents the pinnacle of timekeeping precision. These watches connect to GPS satellites to determine the exact time and location, automatically adjusting to the correct time zone anywhere in the world. This technology is particularly valuable for frequent travelers and professionals who require absolute accuracy.",
            "**Super Titanium™** is another Citizen innovation that combines strength with lightweight comfort. This material is five times harder than stainless steel yet 40% lighter, making it ideal for watches that need to withstand daily wear while remaining comfortable. The titanium is also treated with Duratect surface hardening technology, making it highly resistant to scratches and wear."
          ]
        },
        {
          heading: "Style Meets Functionality",
          paragraphs: [
            "While Citizen is known for its technological innovations, the brand never compromises on style. Citizen watches feature diverse designs that cater to various tastes and occasions. The **Promaster, Chandler, Brycen, and Corso** collections offer sophisticated, contemporary designs perfect for everyday wear and formal occasions, with Promaster appealing to adventure enthusiasts with its rugged, professional-grade timepieces designed for diving, aviation, and land exploration.",
            "Each collection reflects Citizen's commitment to creating watches that are not just timepieces but expressions of personal style. Whether you prefer the bold functionality of a dive watch, the elegant simplicity of a dress watch, or the sporty appeal of a chronograph, Citizen offers options that seamlessly blend form and function."
          ]
        },
        {
          heading: "Why Citizen Endures",
          paragraphs: [
            "What sets Citizen apart in the competitive watch market is its unique combination of **form, function, and philosophy**. The brand has managed to maintain its core values—accessibility, innovation, and environmental responsibility—while continuously evolving to meet changing consumer needs and technological possibilities.",
            "Citizen watches offer exceptional value, providing advanced technology and quality craftsmanship at accessible price points. This commitment to value, combined with the brand's environmental consciousness and innovative spirit, has created a loyal customer base that spans generations."
          ]
        },
        {
          heading: "Final Thoughts",
          paragraphs: [
            "Citizen Watch represents the perfect fusion of tradition and innovation, quality and accessibility, style and sustainability. As the brand looks to the future, it continues to push boundaries while remaining true to its founding mission of creating exceptional timepieces for all citizens of the world. Whether you're drawn to the environmental benefits of Eco-Drive, the precision of satellite timekeeping, or simply the reliable elegance of a well-crafted watch, Citizen offers something for everyone.",
            "In an era where consumers are increasingly conscious of their environmental impact and value innovation that serves a greater purpose, Citizen's commitment to sustainable technology and accessible quality positions it as a brand for the future. The legacy of Citizen is not just in the watches it has created but in the values it represents: innovation that serves, quality that endures, and a vision that looks forward while honoring tradition."
          ]
        }
      ]
    }
  }
};

export async function generateStaticParams() {
  return blogPostSlugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = blogPosts[slug] || blogPosts['citizen-watch-legacy']; // Fallback to default

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <Link href="/blog" className="text-gray-600 hover:text-gray-900">
            Blog
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Blog Details</span>
        </nav>

        {/* Main Image */}
        <div className="relative w-full h-64 md:h-80 mb-8 bg-gray-100 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {post.title}
        </h1>

        {/* Introductory Paragraph */}
        <p className="text-gray-900 mb-8 leading-relaxed text-base md:text-lg">
          {post.content.intro}
        </p>

        {/* Content Sections */}
        <div className="space-y-8">
          {post.content.sections.map((section, index) => (
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

