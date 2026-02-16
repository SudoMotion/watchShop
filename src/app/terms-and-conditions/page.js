import { getTermsConditions } from '@/stores/pageAPI';
import Link from 'next/link';
import React from 'react';

export default async function TermsAndConditionsPage() {
  const data = await getTermsConditions();

  const { terms_title, terms_desc } = data ?? {};

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Terms and Conditions</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {terms_title ?? 'Terms and Conditions'}
        </h1>

        {terms_desc ? (
          <div
            className="prose prose-gray max-w-none text-gray-900 leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
            dangerouslySetInnerHTML={{ __html: terms_desc }}
          />
        ) : (
          <p className="text-gray-900">Content is not available.</p>
        )}
      </div>
    </div>
  );
}
