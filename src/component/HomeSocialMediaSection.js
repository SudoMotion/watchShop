import Link from "next/link";
import { SOCIAL_MEDIA_LINKS } from "@/lib/socialMedia";

export default function HomeSocialMediaSection() {
  return (
    <section className="border-y border-gray-200 bg-gray-50 py-6 md:py-12">
      <div className="mx-auto max-w-7xl px-2">
        <h2 className="text-center text-xl font-semibold tracking-tight text-gray-900 md:text-3xl">
          Watch Shop BD Social Media Activity
        </h2>
        <p className="mx-auto mt-1.5 max-w-2xl text-center text-xs text-gray-600 md:mt-2 md:text-base">
          Follow us for new arrivals, deals, and watch industry updates.
        </p>
        <ul className="mt-5 grid grid-cols-3 gap-2 md:mt-8 md:grid-cols-5 md:gap-5 lg:gap-6">
          {SOCIAL_MEDIA_LINKS.map((item) => (
            <li key={item.key} className="min-w-0">
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full min-w-0 flex-col items-center gap-1 rounded-lg border border-gray-200 bg-white px-1.5 py-2 text-center shadow-sm transition hover:border-gray-300 hover:shadow-md md:gap-2 md:rounded-xl md:px-4 md:py-4 lg:px-5 lg:py-5"
              >
                <span
                  className={`${item.linkClassName} flex shrink-0 origin-center scale-[0.88] items-center justify-center md:scale-100`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt="" className={item.imgClassName} />
                </span>
                <span className="line-clamp-2 text-[10px] font-medium leading-tight text-gray-800 md:text-sm md:leading-normal">
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
