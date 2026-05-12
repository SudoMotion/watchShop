import Link from "next/link";
import { SOCIAL_MEDIA_LINKS } from "@/lib/socialMedia";

export default function HomeSocialMediaSection() {
  return (
    <section className="border-y border-gray-200 bg-gray-50 py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-2">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
          Watch Shop BD Social Media Activity
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600 md:text-base">
          Follow us for new arrivals, deals, and watch industry updates.
        </p>
        <ul className="mt-8 flex flex-wrap items-stretch justify-center gap-4 sm:gap-6 md:gap-8">
          {SOCIAL_MEDIA_LINKS.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-28 flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-4 text-center shadow-sm transition hover:border-gray-300 hover:shadow-md md:min-w-36 md:px-5 md:py-5"
              >
                <span className={item.linkClassName}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt="" className={item.imgClassName} />
                </span>
                <span className="text-xs font-medium text-gray-800 md:text-sm">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
