import { productList } from "@/_lib/productList";
import ProductPageClient from "./ProductPageClient";

export async function generateStaticParams() {
  return productList.map(product => ({
    productSlug: product.slug
  }));
}

export default function ProductPage({ params }) {
  return <ProductPageClient params={params} />;
}