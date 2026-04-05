import Link from 'next/link';

export function EmptyProducts({
  title = 'No products found',
  description = 'Try changing filters or sort, or browse other categories.',
  actionLabel = 'Back to home',
  actionHref = '/',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/80">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200/80 text-gray-500"
        aria-hidden
      >
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.25}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-gray-600 max-w-md leading-relaxed">{description}</p>
      ) : null}
      {actionHref ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
