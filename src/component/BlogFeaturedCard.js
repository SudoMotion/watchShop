import Image from 'next/image';
import Link from 'next/link';
import { NEXT_PUBLIC_API_URL } from '@/config';
import { htmlToPlainText } from '@/lib/htmlToPlainText';

function resolveImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${NEXT_PUBLIC_API_URL}/${String(path).replace(/^\//, '')}`;
}

function formatListDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function estimateReadMinutesFromText(text) {
  const plain = htmlToPlainText(String(text || '')).trim();
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogFeaturedCard({ post }) {
  const imageSrc =
    resolveImageUrl(post.image) ||
    resolveImageUrl(post.banner_image) ||
    '/images/placeholder.jpg';
  const slug = post.slug || post.id;
  const dateRaw = post.date || post.created_at;
  const excerpt = htmlToPlainText(
    post.excerpt || post.description || ''
  ).trim();
  const label =
    post.tag ||
    post.category?.name ||
    post.category_name ||
    'Blog';
  const authorName =
    post.author_name ||
    post.author?.name ||
    post.user?.name ||
    post.writer_name ||
    'WatchShop BD';
  const avatarSrc =
    resolveImageUrl(
      post.author_image ||
        post.author?.image ||
        post.user?.image ||
        post.avatar
    ) || null;
  const readMins =
    Number(post.reading_time) ||
    Number(post.read_time) ||
    Number(post.read_time_minutes) ||
    estimateReadMinutesFromText(post.excerpt || post.description || '');
  const dateStr = formatListDate(dateRaw);

  return (
    <Link
      href={`/blog/${slug}`}
      className="group mb-10 md:mb-12 block w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <article className="flex min-h-[280px] flex-col lg:min-h-[320px] lg:flex-row">
        <div className="relative aspect-[16/10] w-full shrink-0 bg-gray-100 lg:aspect-auto lg:w-[62%] lg:min-h-[280px]">
          <Image
            src={imageSrc}
            alt={post.title || 'Blog post'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02] lg:object-center"
            sizes="(max-width: 1024px) 100vw, 62vw"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:w-[38%] lg:py-12 lg:pl-12 lg:pr-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            {label}
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-[1.75rem] lg:leading-snug">
            <span className="line-clamp-3 group-hover:text-gray-800">
              {post.title}
            </span>
          </h2>
          {excerpt ? (
            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-gray-600 md:text-base">
              {excerpt}
            </p>
          ) : null}

          <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-200 ring-2 ring-white">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600"
                  aria-hidden
                >
                  {authorName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {authorName}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {dateStr ? (
                  <>
                    {dateStr}
                    <span className="mx-1.5 text-gray-300" aria-hidden>
                      •
                    </span>
                  </>
                ) : null}
                {readMins} min read
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
