import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 bg-white px-4">
      <div className="relative h-28 w-56 shrink-0 animate-pulse sm:h-32 sm:w-64">
        <Image
          src="/images/logo.jpeg"
          alt="Loading"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 640px) 224px, 256px"
        />
      </div>
      <p className="text-sm font-medium text-gray-500">Loading product…</p>
    </div>
  );
}
