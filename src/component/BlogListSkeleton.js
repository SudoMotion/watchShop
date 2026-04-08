function FeaturedBlogSkeleton() {
  return (
    <div
      className="mb-10 md:mb-12 flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white lg:min-h-[320px] lg:flex-row animate-pulse"
      aria-hidden
    >
      <div className="aspect-[16/10] w-full shrink-0 bg-gray-200 lg:aspect-auto lg:w-[62%] lg:min-h-[280px]" />
      <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:w-[38%] lg:py-12 lg:pl-12 lg:pr-10">
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="mt-4 h-8 w-full max-w-md bg-gray-200 rounded" />
        <div className="mt-3 h-8 w-4/5 max-w-lg bg-gray-200 rounded" />
        <div className="mt-6 space-y-2">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
        </div>
        <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
          <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-3 w-40 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="w-full h-48 md:h-56 bg-gray-200" />
      <div className="p-4 md:p-6 flex-1 flex flex-col gap-3">
        <div className="h-6 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-24 mt-auto" />
      </div>
    </div>
  );
}

/**
 * @param {number} count - Total placeholder slots: 1 featured row + (count - 1) grid cards.
 */
export function BlogListSkeleton({ count = 6 }) {
  const gridCount = Math.max(0, count - 1);

  return (
    <>
      <FeaturedBlogSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: gridCount }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <BlogCardSkeleton />
          </div>
        ))}
      </div>
    </>
  );
}
