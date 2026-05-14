"use client";

import { usePathname } from "next/navigation";
import HomeSocialMediaSection from "@/component/HomeSocialMediaSection";

/** Renders social strip from layout on all routes except `/` (home owns its own copy in `page.js`). */
export default function ConditionalLayoutSocial() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <HomeSocialMediaSection />;
}
