"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWishlist, setWishlist } from "@/lib/wishlistStorage";
import { getCart, setCart } from "@/lib/cartStorage";
import { NEXT_PUBLIC_API_URL } from "@/config";

/** Ensure image URL is absolute. */
const wishlistImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = NEXT_PUBLIC_API_URL || "";
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
};

const roundedDiscountLabel = (value) => {
  if (value == null) return "";
  const n = Number(String(value).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${Math.round(n)}% OFF`;
};

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWishlistItems(getWishlist());
    setLoading(false);
  }, []);

  const removeFromWishlist = (id) => {
    const next = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(next);
    setWishlist(next);
  };

  const addToCart = (item) => {
    const cart = getCart();
    const existing = cart.find((c) => c.id === item.id);
    const cartItem = {
      id: item.id,
      image: item.image,
      title: item.title,
      slug: item.slug,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: 1,
      stock: Math.max(1, item.stock || 0),
    };
    const nextCart = existing
      ? cart.map((c) =>
          c.id === item.id ? { ...c, quantity: Math.min(c.quantity + 1, c.stock) } : c
        )
      : [...cart, cartItem];
    setCart(nextCart);
  };

  const moveAllToCart = () => {
    wishlistItems.forEach((item) => {
      if (item.inStock) addToCart(item);
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setWishlist([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-gray-200" />
              <div className="h-6 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="md:text-3xl text-2xl font-bold mb-4">My Wishlist</h1>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start adding items you love to your wishlist!</p>
            <Link 
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="md:text-3xl text-2xl font-bold mb-4 md:mb-0">My Wishlist</h1>
          <div className="flex gap-3">
            <button
              onClick={moveAllToCart}
              className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
            >
              Add All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              Clear Wishlist
            </button>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* Product Image */}
              <Link href={`/product/${item.slug}`} className="relative block">
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {wishlistImageUrl(item.image) ? (
                    <>
                      <Image
                        src={wishlistImageUrl(item.image)}
                        alt={item.title}
                        fill
                        className="object-contain group-hover:opacity-0 transition-opacity duration-300"
                        unoptimized
                      />
                      {(item.image2 && wishlistImageUrl(item.image2)) ? (
                        <Image
                          src={wishlistImageUrl(item.image2)}
                          alt={item.title}
                          fill
                          className="object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          unoptimized
                        />
                      ) : null}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                  )}
                  {roundedDiscountLabel(item.discount) && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {roundedDiscountLabel(item.discount)}
                    </div>
                  )}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-black px-4 py-2 rounded font-semibold text-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-red-600 transition-colors mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{item.brand}</p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-red-600">{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                  )}
                </div>

                {/* Stock Status */}
                {item.inStock && (
                  <p className="text-xs text-green-600 mb-3">
                    {item.stock > 0 ? `In Stock (${item.stock} available)` : 'In Stock'}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {item.inStock ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold cursor-not-allowed text-sm"
                    >
                      Out of Stock
                    </button>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

