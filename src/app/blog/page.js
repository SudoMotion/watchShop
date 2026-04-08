'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BlogFeaturedCard from '@/component/BlogFeaturedCard';
import { Pagination } from '@/component/Pagination';
import { BlogListSkeleton } from '@/component/BlogListSkeleton';
import { NEXT_PUBLIC_API_URL } from '@/config';
import { BLOG_LIST_PER_PAGE, useGetBlogList } from '@/hooks/useGetBlogList';
import { htmlToPlainText } from '@/lib/htmlToPlainText';

function parsePageParam(value) {
  const n = parseInt(value ?? '', 10);
  if (Number.isFinite(n) && n >= 1) return n;
  return 1;
}

function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parsePageParam(searchParams.get('page'));

  const { blogs, lastPage, isLoading } = useGetBlogList(currentPage);

  const onPageChange = useCallback(
    (nextRaw) => {
      const next = Math.max(1, Number(nextRaw));
      const params = new URLSearchParams(searchParams.toString());
      if (next <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(next));
      }
      const qs = params.toString();
      router.push(qs ? `/blog?${qs}` : '/blog', { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              aria-hidden
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            Home
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-900">Blog</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Blog
        </h1>

        {isLoading ? (
          <BlogListSkeleton count={BLOG_LIST_PER_PAGE} />
        ) : (
          <>
            {blogs?.[0] ? <BlogFeaturedCard post={blogs[0]} /> : null}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {(blogs || []).slice(1).map(
                (post) => {
                  const imageSrc = post.image?.startsWith('http')
                    ? post.image
                    : `${NEXT_PUBLIC_API_URL}/${post.image || ''}`;
                  const slug = post.slug || post.id;
                  const date = post.date || post.created_at;
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${slug}`}
                      className="group block"
                    >
                      <article className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full flex flex-col">
                        <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden">
                          <Image
                            src={imageSrc || '/images/placeholder.jpg'}
                            alt={post.title || 'Blog post'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        <div className="p-4 md:p-6 flex-1 flex flex-col">
                          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 min-h-0">
                            {htmlToPlainText(
                              post.excerpt || post.description || ''
                            )}
                          </p>
                          <div className="text-xs text-gray-500 mt-auto">
                            {date
                              ? new Date(date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : null}
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                }
              )}
            </div>
          </>
        )}
        <div>
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <BlogListSkeleton count={BLOG_LIST_PER_PAGE} />
        </div>
      </div>
    }
    >
      <BlogPageContent />
    </Suspense>
  );
}
