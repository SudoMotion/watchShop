import React from "react";

export default function DesktopSearch({ open, setOpen, onTransparent, searchRef }) {
  return (
    <div className="relative" ref={searchRef}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`hidden md:flex items-center justify-center p-2 ${
            onTransparent ? "md:md:text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      )}
      {open && (
        <form className="mt-1 rounded-md border border-gray-200 bg-white p-2 z-50 flex items-center gap-x-2 min-w-[200px]">
          <input type="text" name="" id="" placeholder="Search for products" className="w-full outline-none text-gray-900" />
          <svg
            className="w-5 h-5 shrink-0 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </form>
      )}
    </div>
  );
}
