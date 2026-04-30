import CategoryPageClient from './CategoryPageClient';

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;
  return <CategoryPageClient categorySlug={categorySlug} />;
}

