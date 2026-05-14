import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getOutlets } from "@/stores/HomeAPI";
import { Backend_Base_Url } from "@/config";

/** Served from `public/images/shop-placeholder.png` */
const SHOP_PLACEHOLDER_SRC = "/images/shop-placeholder.png";

function branchImageUrl(branch) {
  const url = branch?.outlet_image_url;
  if (url && String(url).trim().startsWith("http")) {
    return String(url).trim();
  }
  const path = branch?.outlet_image;
  if (path && String(path).trim()) {
    const p = String(path).replace(/^\//, "");
    return `${String(Backend_Base_Url).replace(/\/$/, "")}/${p}`;
  }
  return SHOP_PLACEHOLDER_SRC;
}

function normalizeAddress(raw) {
  if (raw == null) return "";
  return String(raw).replace(/\r\n/g, "\n").trim();
}

function mapHrefForBranch(branch) {
  const link = branch?.map_link && String(branch.map_link).trim();
  if (link) return link;
  const q = normalizeAddress(branch?.address);
  if (!q) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export default async function OutletsPage() {
  const result = (await getOutlets()) ?? {};
  const branches = Array.isArray(result.branches) ? result.branches : [];

  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">Outlets</span>
        </nav>

        <header className="mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Our Outlets
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Visit us in person to try on watches and get expert advice. All outlets stock authentic timepieces with full warranty.
          </p>
        </header>

        {branches.length === 0 ? (
          <p className="text-sm text-gray-600">No outlet branches are listed yet.</p>
        ) : (
          <div className="grid gap-8 md:gap-5 sm:grid-cols-1 lg:grid-cols-3">
            {branches.map((branch, index) => {
              const displayImageSrc = branchImageUrl(branch);
              const address = normalizeAddress(branch?.address);
              const mapLink = mapHrefForBranch(branch);
              const phone =
                branch?.phone && String(branch.phone).trim()
                  ? String(branch.phone).trim()
                  : null;
              const email =
                branch?.email && String(branch.email).trim()
                  ? String(branch.email).trim()
                  : null;

              return (
                <article
                  key={branch.id ?? index}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-2 hover:border-teal-200/60"
                >
                  <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={displayImageSrc}
                      alt={String(branch.name || "Outlet")}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  </div>
                  <div className="p-6 md:p-7 transition-colors duration-300">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      {branch.name}
                    </h2>
                    {address ? (
                      <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line group-hover:text-gray-700 transition-colors duration-300">
                        {address}
                      </p>
                    ) : null}
                    <div className="space-y-2 mb-6">
                      {phone ? (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Phone: </span>
                          <a
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="text-teal-700 hover:underline"
                          >
                            {phone}
                          </a>
                        </p>
                      ) : null}
                      {email ? (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Email: </span>
                          <a
                            href={`mailto:${email}`}
                            className="text-teal-700 hover:underline break-all"
                          >
                            {email}
                          </a>
                        </p>
                      ) : null}
                    </div>
                    {mapLink ? (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 hover:gap-3 active:scale-100"
                      >
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Click Here For Map
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
