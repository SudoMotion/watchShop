export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-100 overflow-hidden bg-white animate-pulse"
          aria-hidden
        >
          <div className="aspect-square bg-gray-200 w-full" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
