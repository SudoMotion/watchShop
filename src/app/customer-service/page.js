import { getCustomerService } from '@/stores/pageAPI';
import Link from 'next/link';
import React from 'react';

const contentClass =
  'prose prose-gray max-w-none text-gray-900 leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800';

export default async function CustomerServicePage() {
  const data = await getCustomerService();

  const { customer_service_title, customer_service } = data ?? {};

  const isHtml = typeof customer_service === 'string' && customer_service.includes('<');

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Customer Service</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {customer_service_title ?? 'Customer Service'}
        </h1>

        {customer_service ? (
          isHtml ? (
            <div
              className={contentClass}
              dangerouslySetInnerHTML={{ __html: customer_service }}
            />
          ) : (
            <p className="text-gray-900 leading-relaxed">{customer_service}</p>
          )
        ) : (
          <p className="text-gray-900">Content is not available.</p>
        )}
      </div>
    </div>
  );
}
