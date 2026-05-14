import {
  buildBrandMetadata,
  getBrandListingPayload,
  extractBrandFromListingPayload,
} from "@/lib/brandMeta";
import BrandPageClient from "./BrandPageClient";

export async function generateMetadata({ params }) {
  const { brandId } = await params;
  if (!brandId) return { title: "Brand" };
  const payload = await getBrandListingPayload(brandId);
  return buildBrandMetadata(payload, brandId);
}

export default async function BrandPage({ params }) {
  const { brandId } = await params;
  const listingPayload = brandId ? await getBrandListingPayload(brandId) : null;
  const description = listingPayload?.brand?.meta_description;
  const initialBrand = extractBrandFromListingPayload(listingPayload);

  return (
    <BrandPageClient brandId={brandId} initialBrand={initialBrand} description={description} />
  );
}
