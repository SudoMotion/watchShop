import CategoryPageClient from "./CategoryPageClient";
import {
  buildCategoryMetadata,
  extractCategoryFromListingPayload,
  getCategoryListingPayload,
} from "@/lib/categoryMeta";

function firstSearchParam(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value).trim();
}

export async function generateMetadata({ params, searchParams }) {
  const { categorySlug } = await params;
  if (!categorySlug) return { title: "Category" };
  const sp = await searchParams;
  const categoryId =
    firstSearchParam(sp?.category_id) ||
    firstSearchParam(sp?.categoryId);
  const payload = await getCategoryListingPayload(categorySlug, categoryId);
  return buildCategoryMetadata(payload, categorySlug, categoryId);
}

export default async function CategoryPage({ params, searchParams }) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  const categoryId =
    firstSearchParam(sp?.category_id) ||
    firstSearchParam(sp?.categoryId);

  const listingPayload = await getCategoryListingPayload(categorySlug, categoryId);
  const cat = extractCategoryFromListingPayload(listingPayload);
  const description = cat?.meta_description != null ? String(cat.meta_description).trim() : "";

  return (
    <CategoryPageClient
      categorySlug={categorySlug}
      categoryId={categoryId}
      description={description}
    />
  );
}

