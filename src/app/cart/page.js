"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  // Mock cart data - in real app, this would come from context/state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: '/images/mockProduct/1.png',
      title: 'Rolex Submariner',
      slug: 'rolex-submariner',
      brand: 'Rolex',
      price: '৳1,250,000',
      originalPrice: '৳1,400,000',
      discount: '11% OFF',
      quantity: 1,
      stock: 5
    },
    {
      id: 3,
      image: '/images/mockProduct/3.png',
      title: 'TAG Heuer Carrera',
      slug: 'tag-heuer-carrera',
      brand: 'TAG Heuer',
      price: '৳650,000',
      originalPrice: '৳720,000',
      discount: '10% OFF',
      quantity: 2,
      stock: 12
    },
    {
      id: 5,
      image: '/images/mockProduct/5.png',
      title: 'Casio G-Shock GA-2100',
      slug: 'casio-g-shock-ga-2100',
      brand: 'Casio',
      price: '৳25,000',
      originalPrice: '৳28,000',
      discount: '11% OFF',
      quantity: 1,
      stock: 50
    }
  ]);

  // Extract numeric price from string (e.g., "৳1,250,000" -> 1250000)
  const getNumericPrice = (priceStr) => {
    return parseInt(priceStr.replace(/[৳,]/g, ''));
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + getNumericPrice(item.price) * item.quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      const original = getNumericPrice(item.originalPrice);
      const current = getNumericPrice(item.price);
      return total + (original - current) * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const shipping = subtotal > 500000 ? 0 : 500; // Free shipping over ৳500,000
  const total = subtotal - discount + shipping;

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.min(newQuantity, item.stock) }
        : item
    ));
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
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
        <h1 className="md:text-3xl text-2xl font-bold mb-4">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                    <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={128}
                        height={128}
                        className="object-contain"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-bold text-red-600">{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                      )}
                      {item.discount && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">{item.discount}</span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="px-4 py-1 min-w-[3rem] text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= item.stock}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      {item.quantity >= item.stock && (
                        <span className="text-xs text-red-600">Max stock reached</span>
                      )}
                    </div>

                    {/* Item Total */}
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-sm text-gray-600">Item Total: </span>
                      <span className="text-lg font-semibold">
                        ৳{(getNumericPrice(item.price) * item.quantity).toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{subtotal.toLocaleString('en-US')}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-৳{discount.toLocaleString('en-US')}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `৳${shipping.toLocaleString('en-US')}`
                    )}
                  </span>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">৳{total.toLocaleString('en-US')}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-4">
                Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="text-center text-xs text-gray-500 mt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <p>100% Authentic Products</p>
                <p className="mt-1">Fast & Free Delivery</p>
              </div>

              {/* EMI Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-800 mb-2">EMI Available</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>3 Months: ৳{Math.round(total / 3).toLocaleString('en-US')}/month</p>
                  <p>6 Months: ৳{Math.round(total / 6).toLocaleString('en-US')}/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

