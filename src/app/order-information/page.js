import Link from 'next/link';
import React from 'react';

export default function OrderInformationPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-600">//</span>
          <span className="text-gray-900">Order Information</span>
        </nav>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          ORDER INFORMATION
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Order Information for Watch Shop BD
        </h2>

        {/* Introductory Paragraph */}
        <p className="text-gray-900 mb-8 leading-relaxed">
          At Watch Shop BD, we are dedicated to delivering a smooth and efficient ordering process to enhance your shopping experience. From placing your order to receiving your timepiece, here is everything you need to know about our order information.
        </p>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1: Placing an Order */}
          <section>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">1. Placing an Order</h3>
            <div className="text-gray-900 leading-relaxed space-y-3">
              <p>
                To place an order on our website, browse our extensive collection of watches and select the item(s) you wish to purchase. Each product page provides detailed descriptions, images, and pricing information to help you make an informed decision. Once you've chosen your watch, click the "Add to Cart" button. You can review your selected items in your shopping cart, where you can modify quantities or remove items if needed.
              </p>
              <p>
                Proceed to checkout by clicking the "Checkout" button. You will be prompted to enter your shipping details, select a shipping method, and choose a payment option. We accept various payment methods, including credit/debit cards and online payment systems. Ensure that all information entered is accurate to avoid any delays in processing.
              </p>
            </div>
          </section>

          {/* Section 2: Order Confirmation */}
          <section>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">2. Order Confirmation</h3>
            <p className="text-gray-900 leading-relaxed mb-4">
              After completing the checkout process, you will receive an order confirmation email. This email includes a summary of your purchase, including the items ordered, shipping address, and estimated delivery date 2/3 day. Please review the confirmation details carefully. If you notice any discrepancies or errors, contact our customer service team immediately to rectify the issue.
            </p>
          </section>

          {/* Section 3: Order Processing */}
          <section>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">3. Order Processing</h3>
            <p className="text-gray-900 leading-relaxed mb-4">
              Once your order is placed, it will be processed within 1-2 business days. During this time, we verify payment details, check product availability, and prepare your shipment. You will receive a notification when your order is ready for dispatch, along with a tracking number to monitor the status of your shipment. Cash on delivery available is also available in all over Bangladesh.
            </p>
          </section>

          {/* Section 4: Modifications and Cancellations */}
          <section>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">4. Modifications and Cancellations</h3>
            <p className="text-gray-900 leading-relaxed mb-4">
              If you need to make changes to your order or cancel it, contact our customer service team as soon as possible. We can accommodate changes or cancellations only if the request is made before the order is processed or shipped. Once an order is in transit, modifications or cancellations may not be possible.
            </p>
          </section>

          {/* Section 5: Order Tracking */}
          <section>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">5. Order Tracking</h3>
            <p className="text-gray-900 leading-relaxed mb-4">
              After your order has been dispatched, you will receive a tracking number via email. Use this tracking number to monitor your order's progress through the courier's website. If you have any concerns about your shipment or if it does not arrive within the expected timeframe, contact our customer service team for assistance.
            </p>
          </section>

          {/* Section 6: Issues with Orders */}
          <section>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">6. Issues with Orders</h3>
            <p className="text-gray-900 leading-relaxed mb-4">
              If you experience any issues with your order, such as receiving the wrong item or a damaged product, please contact our customer service team immediately. We are committed to resolving any problems promptly and ensuring your complete satisfaction. We offer support for returns, exchanges, and refunds in accordance with our return policy.
            </p>
          </section>
        </div>

        {/* Concluding Paragraph */}
        <p className="text-gray-900 mt-8 leading-relaxed">
          At Watch Shop BD, our goal is to make your shopping experience as enjoyable and efficient as possible. Should you have any questions or need assistance with your order, our dedicated customer support team is here to help. Thank you for choosing Watch Shop BD for your timepiece needs.
        </p>
      </div>
    </div>
  );
}

