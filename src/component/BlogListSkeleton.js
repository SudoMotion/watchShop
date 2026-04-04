export function BlogListSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 overflow-hidden h-full flex flex-col animate-pulse"
          aria-hidden
        >
          <div className="w-full h-48 md:h-56 bg-gray-200" />
          <div className="p-4 md:p-6 flex-1 flex flex-col gap-3">
            <div className="h-6 bg-gray-200 rounded w-4/5" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-24 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
