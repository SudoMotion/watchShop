import Link from 'next/link';
import Image from 'next/image';
import { Pagination } from '@/component/Pagination';
import { getBlogs } from '@/stores/homeSpecification';
import { NEXT_PUBLIC_API_URL } from '@/config';

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Blog</span>
        </nav>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Blog
        </h1>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {(blogs || []).map((post) => {
            const imageSrc = post.image?.startsWith('http') ? post.image : `${NEXT_PUBLIC_API_URL}/${post.image || ''}`;
            const slug = post.slug || post.id;
            const date = post.date || post.created_at;
            return (
              <Link
                key={post.id}
                href={`/blog/${slug}`}
                className="group block"
              >
                <article className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden">
                    <Image
                      src={imageSrc || '/images/placeholder.jpg'}
                      alt={post.title || 'Blog post'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt || post.description || ''}
                    </p>
                    <div className="text-xs text-gray-500 mt-auto">
                      {date ? new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : null}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        <div>
            <Pagination/>
        </div>
      </div>
    </div>
  );
}

