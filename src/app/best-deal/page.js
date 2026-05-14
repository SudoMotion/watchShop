import PageProductListClient from "@/component/PageProductListClient";

export const dynamic = "force-dynamic";

export default function BestDealPage() {
  return <PageProductListClient listType="best-deal" defaultTitle="Best Deals" />;
}
