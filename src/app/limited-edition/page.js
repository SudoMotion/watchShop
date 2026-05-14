import ProductCard2 from "@/component/ProductCard2";
import { getLimitedEdition } from "@/stores/ProductAPI";

export const dynamic = "force-dynamic";

export default async function LimitedEditionPage() {
  const response = (await getLimitedEdition()) ?? {};
  console.log('response', response)
  const products = Array.isArray(response?.products)
    ? response.products
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
        ? response
        : [];

  const heading =
    typeof response?.page_name === "string" && response.page_name.trim()
      ? response.page_name.trim()
      : "Limited Edition";

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-0 py-10 md:py-16">
      <h1 className="title font-semibold">{heading}</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-x-5 gap-y-10">
          {products.map((product) => (
            <ProductCard2 key={product.id} item={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-6">
          No limited edition products found.
        </p>
      )}
    </div>
  );
}
