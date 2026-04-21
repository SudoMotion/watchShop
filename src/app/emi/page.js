import Link from "next/link";

export const metadata = {
  title: "EMI Plan",
  description:
    "Learn about EMI eligibility, required documents, installment plans, and how EMI works at WatchShopBD.",
};

const InfoCard = ({ title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    <div className="mt-2 text-sm leading-relaxed text-gray-700">{children}</div>
  </div>
);

export default function EmiPage() {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">EMI Plan</span>
        </nav>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              EMI Plan
            </h1>
            <p className="mt-2 text-gray-600">
              Installment options, eligibility, and how to apply.
            </p>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100"
          >
            FAQ
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoCard title="How EMI works">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                EMI (Equated Monthly Installment) lets you pay in monthly
                installments instead of paying the full amount at once.
              </li>
              <li>
                EMI is available only for eligible products and depends on bank
                approval.
              </li>
              <li>
                Final installment amount and tenure may vary based on your card
                issuer’s policy.
              </li>
            </ul>
          </InfoCard>

          <InfoCard title="Eligibility & requirements">
            <ul className="list-disc pl-5 space-y-1">
              <li>Valid credit card (bank supported for EMI).</li>
              <li>Minimum order amount may apply (bank dependent).</li>
              <li>
                Customer information must match the card holder details in some
                cases.
              </li>
            </ul>
          </InfoCard>

          <InfoCard title="Tenure & plans">
            <p className="text-gray-700">
              Typical tenures include 3 months, 6 months, and sometimes longer.
              Available plans depend on your bank and the product category.
            </p>
            <div className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Example</p>
              <p className="mt-1">
                For a product priced at BDT 12,000, a 6-month plan may show
                roughly BDT 2,000/month (example only).
              </p>
            </div>
          </InfoCard>

          <InfoCard title="Important notes">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                EMI availability shown on product page is an indicator; bank
                approval is required.
              </li>
              <li>
                Any interest/processing fee is determined by your bank (if
                applicable).
              </li>
              <li>
                Refunds/cancellations follow standard store policy; bank EMI
                reversals may take additional time.
              </li>
            </ul>
          </InfoCard>
        </div>

        <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Need help choosing a plan?
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            Contact us with your order amount and preferred tenure, and we’ll
            guide you based on supported banks and current eligibility.
          </p>
        </div>
      </div>
    </div>
  );
}

