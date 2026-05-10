import SearchPageClient from "./SearchPageClient";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const keyword = String(params?.keyword ?? params?.search ?? params?.q ?? "").trim();

  return <SearchPageClient keyword={keyword} />;
}
