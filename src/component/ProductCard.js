import Image from "next/image";

// Base64 encoded SVG for blur placeholder
const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;

export default function ProductCard({ item }) {
  if (!item) {
    return (
      <div className="flex flex-col gap-y-2 items-center text-center animate-pulse">
        <div className="w-[200px] h-[200px] bg-gray-200 rounded-md" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 items-center text-center">
      <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={blurSvg}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <h3 className="font-medium">{item.title}</h3>
      <p className="text-sm text-gray-500">{item.brand}</p>
      <p className="font-semibold">{item.price}</p>
    </div>
  );
}
