import { productList } from "@/_lib/productList";
import { buildProductMetadata } from "@/lib/productMeta";
import { getAllProductSlugs, getProductBySlug } from "@/stores/ProductAPI";
import ProductPageClient from "./ProductPageClient";

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  if (!productSlug || productSlug === "placeholder") {
    return { title: "Product" };
  }
  const data = await getProductBySlug(productSlug);
  return buildProductMetadata(data, productSlug);
}

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