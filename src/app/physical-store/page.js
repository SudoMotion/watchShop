import { getPhysicalStore } from '@/stores/pageAPI';
import Link from 'next/link';
import React from 'react';

export default async function PhysicalStorePage() {
  const data = await getPhysicalStore();

  const { physical_store_title, physical_store, title, content } = data ?? {};
  const pageTitle = physical_store_title ?? title ?? 'Physical Store';
  const rawContent = physical_store ?? content;

  const isHtml = typeof rawContent === 'string' && rawContent.includes('<');

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Physical Store</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {pageTitle}
        </h1>

        {rawContent ? (
          isHtml ? (
            <div
              className="prose prose-gray max-w-none text-gray-900 leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
              dangerouslySetInnerHTML={{ __html: rawContent }}
            />
          ) : (
            <p className="text-gray-900 leading-relaxed">{String(rawContent)}</p>
          )
        ) : (
          <p className="text-gray-900">Content is not available.</p>
        )}
      </div>
    </div>
  );
}
