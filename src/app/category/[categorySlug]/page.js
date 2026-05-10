import CategoryPageClient from "./CategoryPageClient";

function firstSearchParam(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value).trim();
}

export default async function CategoryPage({ params, searchParams }) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  const categoryId =
    firstSearchParam(sp?.category_id) ||
    firstSearchParam(sp?.categoryId);

  return (
    <CategoryPageClient categorySlug={categorySlug} categoryId={categoryId} />
  );
}

