import { getFaq } from '@/stores/pageAPI';
import Link from 'next/link';
import React from 'react';

const contentClass =
  'prose prose-gray max-w-none text-gray-900 leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800';

export default async function FaqPage() {
  const data = await getFaq();

  const { faq_title, faq, title, content } = data ?? {};
  const pageTitle = faq_title ?? title ?? 'FAQ';
  const rawContent = faq ?? content;

  const isHtml = typeof rawContent === 'string' && rawContent.includes('<');
  const isArray = Array.isArray(rawContent);

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">FAQ</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {pageTitle}
        </h1>

        {!rawContent && <p className="text-gray-900">Content is not available.</p>}
        {rawContent && isHtml && (
          <div className={contentClass} dangerouslySetInnerHTML={{ __html: rawContent }} />
        )}
        {rawContent && isArray && (
          <div className="space-y-6">
            {rawContent.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                {(item.question || item.title) && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.question ?? item.title}
                  </h3>
                )}
                {(item.answer || item.content) && (() => {
                  const text = item.answer ?? item.content;
                  const isItemHtml = typeof text === 'string' && text.includes('<');
                  return isItemHtml ? (
                    <div className={contentClass} dangerouslySetInnerHTML={{ __html: text }} />
                  ) : (
                    <p className="text-gray-900 leading-relaxed">{String(text)}</p>
                  );
                })()}
              </div>
            ))}
          </div>
        )}
        {rawContent && !isHtml && !isArray && (
          <p className="text-gray-900 leading-relaxed">{String(rawContent)}</p>
        )}
      </div>
    </div>
  );
}
