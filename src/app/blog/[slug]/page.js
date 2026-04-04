import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogDetails } from '@/stores/blogAPI';
import { NEXT_PUBLIC_API_URL } from '@/config';

function unwrapBlogDetail(apiResult) {
  if (!apiResult || typeof apiResult !== 'object') return null;
  const inner = apiResult.data !== undefined ? apiResult.data : apiResult;
  if (!inner || typeof inner !== 'object') return null;
  return inner;
}

function resolveMediaUrl(path) {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${NEXT_PUBLIC_API_URL}/${String(path).replace(/^\//, '')}`;
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const raw = await getBlogDetails(slug);
  const post = unwrapBlogDetail(raw);

  if (!post || (post.id == null && !post.title)) {
    notFound();
  }

  const heroSrc = resolveMediaUrl(post.banner_image || post.image);
  const created = post.created_at ? new Date(post.created_at) : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:text-base">
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
          <span className="text-gray-600">/</span>
          <Link href="/blog" className="text-gray-600 hover:text-gray-900">
            Blog
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-900 line-clamp-1 max-w-[min(100%,14rem)] md:max-w-md">
            {post.title || 'Article'}
          </span>
        </nav>

        <div className="relative w-full h-64 md:h-80 mb-8 bg-gray-100 overflow-hidden rounded-lg">
          <Image
            src={heroSrc}
            alt={post.title || 'Blog post'}
            fill
            className="object-cover"
            // sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </div>

        {post.tag ? (
          <p className="text-sm font-medium text-gray-500 mb-2">{post.tag}</p>
        ) : null}

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {created ? (
          <time
            dateTime={post.created_at}
            className="text-sm text-gray-500 block mb-8"
          >
            {created.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        ) : null}

        <div
          className="blog-content max-w-none text-gray-900 leading-relaxed
            [&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:leading-tight
            [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
            [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
            [&_p]:mb-4 [&_p]:leading-relaxed
            [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6
            [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6
            [&_li]:my-1
            [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
            [&_strong]:font-semibold [&_b]:font-semibold"
          dangerouslySetInnerHTML={{
            __html: post.description || '',
          }}
        />
      </div>
    </div>
  );
}
