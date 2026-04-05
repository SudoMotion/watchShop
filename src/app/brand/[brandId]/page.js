import BrandPageClient from './BrandPageClient';

export default async function BrandPage({ params }) {
  const { brandId } = await params;
  return <BrandPageClient brandId={brandId} />;
}
