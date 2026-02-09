import { productList } from "@/_lib/productList";
import { getAllProductSlugs } from "@/stores/ProductAPI";
import ProductPageClient from "./ProductPageClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  let slugs = [];
  try {
    slugs = await getAllProductSlugs();
  } catch (_) {
    // ignore
  }
  if (slugs.length === 0) {
    slugs = productList.map((p) => p.slug).filter(Boolean);
  }
  if (slugs.length === 0) {
    return [{ productSlug: "placeholder" }];
  }
  return slugs.map((productSlug) => ({ productSlug }));
}

export default async function ProductPage({ params }) {
  const { productSlug } = await params;
  return <ProductPageClient params={{ productSlug }} />;
}