"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Backend_Base_Url } from "@/config";
import { htmlToPlainText } from "@/lib/htmlToPlainText";
import { isMagazinePost } from "@/lib/isMagazinePost";
import { useGetBlogList } from "@/hooks/useGetBlogList";

const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;

export default function HomeMagazineSection() {
  const { blogs, isLoading } = useGetBlogList(1, { perPage: 500 });

  const magazinePosts = useMemo(() => {
    if (!Array.isArray(blogs)) return [];
    return blogs.filter((post) => isMagazinePost(post));
  }, [blogs]);
  return (
    <div className="max-w-7xl mx-auto mb-10 px-2">
      <h1 className="text-2xl md:text-3xl font-semibold">
        WATCHSHOPBD:{" "}
        <Link
          href="/blog"
          className="hover:text-red-600 transition-all duration-200"
        >
          LATEST MAGAZINE OF WATCH INDUSTRY
        </Link>
      </h1>
      {isLoading ? (
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[0, 1, 2].map((k) => (
            <div key={k} className="animate-pulse flex flex-col gap-y-2">
              <div className="aspect-5/4 w-full rounded-md bg-gray-200" />
              <div className="h-5 w-2/3 rounded bg-gray-200" />
              <div className="h-6 w-full rounded bg-gray-200" />
              <div className="h-12 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : magazinePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {magazinePosts.map((post) => {
            const media = post.image || post.banner_image;
            const mediaStr = media != null ? String(media).trim() : "";
            const imgSrc = !mediaStr
              ? "/images/ladies.jpg"
              : mediaStr.startsWith("http")
                ? mediaStr
                : `${Backend_Base_Url}/${mediaStr.replace(/^\//, "")}`;
            const href = `/blog/${post.slug ?? post.id}`;
            const excerpt =
              htmlToPlainText(post.description || post.excerpt || "") || "";

            return (
              <Link
                key={post.id}
                href={href}
                className="group flex flex-col gap-y-1"
              >
                <div className="rounded-md overflow-hidden">
                  <Image
                    placeholder="blur"
                    blurDataURL={blurSvg}
                    src={imgSrc}
                    className="w-full object-contain rounded-md transition-transform duration-300 group-hover:scale-110"
                    alt={post.title || "Magazine"}
                    width={500}
                    height={400}
                  />
                </div>
                {post.tag ? (
                  <p className="text-lg font-medium">{post.tag}</p>
                ) : null}
                <p className="text-xl">{post.title}</p>
                {excerpt ? (
                  <p className="line-clamp-3 text-gray-600">{excerpt}</p>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
