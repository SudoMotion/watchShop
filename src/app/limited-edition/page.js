import PageProductListClient from "@/component/PageProductListClient";

export const dynamic = "force-dynamic";

export default function LimitedEditionPage() {
  return (
    <PageProductListClient listType="limited-edition" defaultTitle="Limited Edition" />
  );
}
