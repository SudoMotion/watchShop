import ProductCard2 from "@/component/ProductCard2";
import { postSearchProducts } from "@/stores/ProductAPI";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const keyword = String(params?.keyword ?? params?.search ?? params?.q ?? "").trim();

  let products = [];
  let relatedKeywords = [];

  {
    const response = await postSearchProducts({ search: keyword });
    const payload = response?.data ?? response ?? {};
    products = Array.isArray(payload?.products)
      ? payload.products
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response)
          ? response
          : [];
    relatedKeywords = Array.isArray(payload?.related_keywords)
      ? payload.related_keywords
      : [];
  }

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-0 py-10 md:py-16">
      <h1 className="title font-semibold">Search Results</h1>
      <p className="text-sm text-gray-600 mt-1">
        Keyword: <span className="font-semibold text-gray-800">{keyword || "-"}</span>
      </p>

      {relatedKeywords.length > 0 && (
        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
            Related keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedKeywords.map((item, index) => (
              <Link
                key={`${item}-${index}`}
                href={`/search?keyword=${encodeURIComponent(String(item))}`}
                className="rounded bg-gray-100 hover:bg-gray-200 px-2 py-1 text-xs text-gray-700 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-x-5 gap-y-10">
          {products.map((product) => (
            <ProductCard2 key={product.id} item={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-6">No products found for this keyword.</p>
      )}
    </div>
  );
}
