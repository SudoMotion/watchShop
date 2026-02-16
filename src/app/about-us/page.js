import { getAboutPage } from '@/stores/pageAPI';
import Link from 'next/link';
import React from 'react';

const contentClass =
  'prose prose-gray max-w-none text-gray-900 leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800';

function HtmlSection({ title, html, className = '' }) {
  if (!html) return null;
  return (
    <section className={className}>
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      <div className={contentClass} dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}

function TextSection({ title, text, className = '' }) {
  if (!text) return null;
  return (
    <section className={className}>
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      <p className="text-gray-900 leading-relaxed">{text}</p>
    </section>
  );
}

export default async function AboutUsPage() {
  const aboutPage = await getAboutPage();

  const {
    about_title,
    about_us,
    authenticity_title,
    authenticity,
    order_title,
    order_information,
    shipping_title,
    shipping_information,
    terms_title,
    terms_desc,
    privacy_title,
    privacy_desc,
    return_title,
    return_policy,
    customer_service,
  } = aboutPage ?? {};

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">About Us</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {about_title ?? 'ABOUT US'}
        </h1>

        <HtmlSection title={null} html={about_us} className="mb-10" />

        <TextSection
          title={authenticity_title}
          text={authenticity}
          className="mb-10"
        />

        <HtmlSection
          title={order_title}
          html={order_information}
          className="mb-10"
        />

        <HtmlSection
          title={shipping_title}
          html={shipping_information}
          className="mb-10"
        />

        <HtmlSection
          title={terms_title}
          html={terms_desc}
          className="mb-10"
        />

        <HtmlSection
          title={privacy_title}
          html={privacy_desc}
          className="mb-10"
        />

        <HtmlSection
          title={return_title}
          html={return_policy}
          className="mb-10"
        />

        <TextSection
          title="Customer Service"
          text={customer_service}
          className="mb-10"
        />
      </div>
    </div>
  );
}

