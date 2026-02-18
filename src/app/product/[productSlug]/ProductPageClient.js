"use client";
import ProductCard2 from "@/component/ProductCard2";
import ProductSlider from "@/component/ProductSlider";
import { NEXT_PUBLIC_API_URL } from "@/config";
import { getProductBySlug } from "@/stores/ProductAPI";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

/** API returns image as filename (e.g. "Fossil_ES4093 (1).webp") or path ("uploads/product/..."). */
const productImagePath = (path) => {
  if (!path || path.startsWith("http")) return path || "";
  return path.includes("/") ? path : `uploads/product/${path}`;
};
const imgUrl = (path) => (path ? `${NEXT_PUBLIC_API_URL}/${productImagePath(path)}` : "");

export default function ProductPageClient({ params }) {
  const productSlug = params?.productSlug ?? "";
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    getProductBySlug(productSlug)
      .then((data) => {
        setProductData(data);
        const p = data?.product;
        if (p) {
          const first = p.product_image?.[0]?.multiimage || p.thumb_image || p.image;
          setMainImg(imgUrl(first));
        }
      })
      .finally(() => setLoading(false));
  }, [productSlug]);

  const [activeTab, setActiveTab] = useState("editor-note");
  const scrollRef = useRef(null);

  // Refs for each section
  const editorNoteRef = useRef(null);
  const specificationRef = useRef(null);
  const collectionRef = useRef(null);
  const movementRef = useRef(null);

  const product = productData?.product ?? null;
  const sellingPriceNum = Number(
    product?.selling_price || product?.discount_price || product?.price || 0
  );
  const originalPriceNum = Number(product?.price || sellingPriceNum);
  const isEmiAvailable = product?.is_emi_available === "1";
  const inStock = Number(product?.quantity || 0) > 0;

  const calculateEMI = (price, months, interestRate = 0) => {
    if (interestRate === 0) return Math.round(price / months);
    const monthlyRate = interestRate / 100 / 12;
    return Math.round(
      (price * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    );
  };
  const emi3Months = calculateEMI(sellingPriceNum, 3);
  const emi6Months = calculateEMI(sellingPriceNum, 6);

  const images = product
    ? [
        imgUrl(product.thumb_image || product.image),
        ...(product.product_image || product.productImages || []).map((img) =>
          imgUrl(img.multiimage)
        ).filter(Boolean),
      ].filter(Boolean)
    : [];
  const displayImages = images.length ? images : (mainImg ? [mainImg] : []);
  const authentics = productData?.authentics ?? [];
  const related = productData?.related ?? [];
  const productItem = productData?.productItem || product?.productItem || [];
  const brand = product?.brand || null;
  const category = product?.category || null;
  const modelText =
    product?.model ||
    productItem.find((item) => item.label === "Model")?.value ||
    "";
  const movementSpecs = productItem.filter((item) =>
    [
      "Movement",
      "Movement Source",
      "Power Reserve",
      "Precision",
      "Jewels",
      "Caliber No",
      "Functions",
      "Frequency",
    ].includes(item.label)
  );
  const movementSummary =
    movementSpecs.find((item) => item.label === "Movement")?.value || "";

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -120, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 120, behavior: "smooth" });
  };

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const sectionMap = {
      "editor-note": editorNoteRef,
      "specification": specificationRef,
      "collection": collectionRef,
      "movement": movementRef,
    };

    const sectionRef = sectionMap[sectionId];
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveTab(sectionId);
    }
  };

  // Detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "editor-note", ref: editorNoteRef },
        { id: "specification", ref: specificationRef },
        { id: "collection", ref: collectionRef },
        { id: "movement", ref: movementRef },
      ];

      const scrollPosition = window.scrollY + 200; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const offsetTop = section.ref.current.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveTab(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const thumbImages = displayImages.length ? displayImages : ["/images/mockProduct/1.png"];

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-400">Loading product...</div>
      </div>
    );
  }

  if (!productData && !loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-white">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-gray-800">

      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">

        {/* LEFT: IMAGES */}
        <div className="order-1 lg:order-1">
          <div className="border rounded-xl p-3 sm:p-4 md:p-5 flex justify-center">
            <Image
              src={mainImg}
              width={400}
              height={400}
              alt="Watch"
              className="object-contain w-full h-auto max-w-full sm:max-w-md md:max-w-lg"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">

            {/* LEFT ARROW */}
            <button
                onClick={scrollLeft}
                className="p-1.5 sm:p-2 border rounded-lg hover:bg-gray-100 flex-shrink-0 text-sm sm:text-base"
            >
                ◀
            </button>

            {/* THUMB ROW */}
            <div
                ref={scrollRef}
                className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {thumbImages.map((img, i) => (
                <button
                    key={i}
                    onClick={() => setMainImg(img)}
                    className={`border rounded-lg p-1.5 sm:p-2 min-w-[60px] sm:min-w-[70px] md:min-w-20 flex-shrink-0 ${
                    (mainImg || thumbImages[0]) === img ? "border-red-500" : "border-gray-300"
                    }`}
                >
                    <Image
                    src={img}
                    width={90}
                    height={90}
                    alt="Thumb"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                    />
                </button>
                ))}
            </div>

            {/* RIGHT ARROW */}
            <button
                onClick={scrollRight}
                className="p-1.5 sm:p-2 border rounded-lg hover:bg-gray-100 flex-shrink-0 text-sm sm:text-base"
            >
                ▶
            </button>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="order-2 lg:order-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
            {product?.name || product?.meta_title || "Product"}
          </h1>

          <div className="mt-2 sm:mt-3 flex items-baseline gap-2 sm:gap-3">
            {originalPriceNum > 0 && originalPriceNum > sellingPriceNum && (
              <span className="line-through text-xs sm:text-sm text-gray-500">
                ৳{originalPriceNum.toLocaleString("en-BD")}
              </span>
            )}
            {sellingPriceNum > 0 && (
              <span className="text-red-600 font-bold text-base sm:text-lg md:text-xl">
                ৳{sellingPriceNum.toLocaleString("en-BD")}
              </span>
            )}
          </div>

          {modelText && (
            <p className="text-xs sm:text-sm mt-1">Model: {modelText}</p>
          )}

          {/* EMI Section */}
          <div className="mt-3 sm:mt-4 border rounded-xl p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            {isEmiAvailable ? (
              <>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-xs sm:text-sm text-gray-800">EMI Available</span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-3">
                  {/* 3 Months EMI */}
                  <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="text-xs text-gray-600 mb-1">3 Months EMI</div>
                    <div className="text-base sm:text-lg font-bold text-indigo-600">
                      ৳{emi3Months.toLocaleString('en-US')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per month</div>
                  </div>

                  {/* 6 Months EMI */}
                  <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="text-xs text-gray-600 mb-1">6 Months EMI</div>
                    <div className="text-base sm:text-lg font-bold text-indigo-600">
                      ৳{emi6Months.toLocaleString('en-US')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per month</div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-2 sm:mt-3 text-center">
                  Interest rate: 0% | Terms & conditions apply
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="font-semibold text-xs sm:text-sm text-gray-600">EMI Not Available</span>
              </div>
            )}
          </div>

          {!inStock && (
            <p className="mt-2 text-xs sm:text-sm font-medium text-red-500">OUT OF STOCK</p>
          )}

          {/* <ul className="space-y-1.5 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-red-500">●</span> 100% Authentic
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">●</span> Fast Delivery
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">●</span> Secure Checkout
            </li>
          </ul> */}

          {productItem.filter((item) => item.value != null && item.value !== "").length > 0 && (
            <div className="mt-4 sm:mt-5 pt-4 border-t border-gray-200">
              <ul className="space-y-1.5 text-sm text-gray-700">
                {productItem
                  .filter((item) => item.value != null && item.value !== "")
                  .slice(0, 6)
                  .map((item) => (
                    <li key={item.id ?? item.label} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5 shrink-0">●</span>
                      <span>
                        <span className="font-medium text-gray-800">{item.label}:</span>{" "}
                        <span className="text-gray-600">{item.value}</span>
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* SPECS */}
          <div className="mt-6 sm:mt-8 border rounded-xl p-3 sm:p-4 md:p-5">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">To speak an Expert 24/7</h2>
            <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">WhatsApp us at +8801000000000</h2>

            {/* <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="border rounded-lg overflow-hidden flex items-center justify-center border p-2 sm:p-3">
                <Image src="/images/cycle.jpg" alt="Cycle" width={100} height={100} className="w-full h-auto" />
              </div>
              <div className="border rounded-lg overflow-hidden flex items-center justify-center border p-2 sm:p-3">
                <Image src="/images/cycle.jpg" alt="Cycle" width={100} height={100} className="w-full h-auto" />
              </div>
              <div className="border rounded-lg overflow-hidden flex items-center justify-center border p-2 sm:p-3">
                <Image src="/images/busket.jpg" alt="Cycle" width={100} height={100} className="w-full h-auto" />
              </div>
              <div className="border rounded-lg overflow-hidden flex items-center justify-center border p-2 sm:p-3">
                <Image src="/images/warrenty.png" alt="Cycle" width={100} height={100} className="w-full h-auto" />
              </div>
            </div> */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-5 text-center">
            {authentics.length > 0
              ? authentics.map((a) => (
                  <div key={a.id} className="flex flex-col items-center">
                    {a.image && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 relative mb-1">
                        <Image
                          src={imgUrl(a.image)}
                          alt={a.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="font-semibold text-xs sm:text-sm">{a.title}</div>
                  </div>
                ))
              : (
                <>
                  <div><div className="font-semibold text-xs sm:text-sm">100% Authentic</div></div>
                  <div><div className="font-semibold text-xs sm:text-sm">Fast Delivery</div></div>
                  <div><div className="font-semibold text-xs sm:text-sm">Secure Checkout</div></div>
                </>
              )}
          </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-6 sm:mt-8">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 sticky top-0 bg-white shadow-md px-2 sm:px-3 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={() => scrollToSection("editor-note")}
              className={`py-2 px-1 sm:px-2 whitespace-nowrap font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-colors flex-shrink-0 ${
                activeTab === "editor-note"
                  ? "border-b-2 border-red-600 text-black"
                  : "border-b-2 border-transparent text-gray-600 hover:text-black"
              }`}
            >
              Editor's Note
            </button>
            <button
              onClick={() => scrollToSection("specification")}
              className={`py-2 px-1 sm:px-2 whitespace-nowrap font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-colors flex-shrink-0 ${
                activeTab === "specification"
                  ? "border-b-2 border-red-600 text-black"
                  : "border-b-2 border-transparent text-gray-600 hover:text-black"
              }`}
            >
              Full Specification
            </button>
            <button
              onClick={() => scrollToSection("collection")}
              className={`py-2 px-1 sm:px-2 whitespace-nowrap font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-colors flex-shrink-0 ${
                activeTab === "collection"
                  ? "border-b-2 border-red-600 text-black"
                  : "border-b-2 border-transparent text-gray-600 hover:text-black"
              }`}
            >
              About the collection
            </button>
            <button
              onClick={() => scrollToSection("movement")}
              className={`py-2 px-1 sm:px-2 whitespace-nowrap font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-colors flex-shrink-0 ${
                activeTab === "movement"
                  ? "border-b-2 border-red-600 text-black"
                  : "border-b-2 border-transparent text-gray-600 hover:text-black"
              }`}
            >
              MOVEMENT
            </button>
        </div>
        <div className="bg-gray-100 mt-3 sm:mt-4 p-3 sm:p-4 md:p-6">
          <div id="editor-note" ref={editorNoteRef} className="border-b pb-6 sm:pb-8 md:pb-10">
            {product?.description ? (
              <div
                className="text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed text-gray-500">No description available.</p>
            )}
          </div>
          <div id="specification" ref={specificationRef} className="border-b pb-6 sm:pb-8 md:pb-10">
            <div className="max-w-7xl mx-auto mt-6 sm:mt-8 md:mt-10 text-gray-700">
              <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-red-600">
                FULL SPECIFICATION
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {productItem.filter((item) => item.value != null && item.value !== "").map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-2">
                    <p className="text-xs text-gray-500 uppercase">{item.label}</p>
                    <p className="text-sm font-medium mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              {productItem.length === 0 && (
                <p className="text-sm text-gray-500 mt-4">No specifications available.</p>
              )}
            </div>
          </div>
          <div id="collection" ref={collectionRef} className="max-w-7xl mx-auto mt-8 sm:mt-10 md:mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">

              {/* LEFT CONTENT */}
              <div className="lg:col-span-3 text-gray-700 leading-relaxed order-2 lg:order-1">
                <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-red-600 mb-2 sm:mb-3">
                  {brand?.name
                    ? `ABOUT THE ${brand.name.toUpperCase()} COLLECTION`
                    : "ABOUT THE COLLECTION"}
                </h2>

                {brand?.meta_description || category?.meta_description ? (
                  <p className="text-xs sm:text-sm mb-4 sm:mb-6">
                    {brand?.meta_description || category?.meta_description}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm mb-4 sm:mb-6 text-gray-500">
                    Collection information is not available for this product.
                  </p>
                )}
              </div>

              {/* RIGHT IMAGE */}
              <div className="w-full order-1 lg:order-2">
                <Image
                  src="/images/collection.jpg"
                  width={600}
                  height={800}
                  alt={brand?.name ? `${brand.name} collection` : "Watch collection"}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>

            </div>
          </div>
          <div id="movement" ref={movementRef} className="max-w-7xl mx-auto mt-8 sm:mt-10 md:mt-14 px-2 sm:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 items-start">

              {/* LEFT CONTENT */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-red-600 mb-2 sm:mb-3">
                  ABOUT THE MOVEMENT
                </h2>

                {movementSpecs.length > 0 ? (
                  <>
                    {movementSummary && (
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        This watch features a {movementSummary} movement with the following key
                        specifications:
                      </p>
                    )}

                    {/* SPECS GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 sm:gap-y-6 md:gap-y-8 gap-x-4 sm:gap-x-6 md:gap-x-10 mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-gray-700">
                      {movementSpecs.map((spec) => (
                        <div key={spec.id}>
                          <p className="text-gray-400">{spec.label}</p>
                          <p className="font-medium">{spec.value || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Movement information is not available for this product.
                  </p>
                )}
              </div>

              {/* RIGHT IMAGE */}
              <div className="flex justify-center order-1 lg:order-2">
                <Image
                  src="/images/circular.avif"
                  width={500}
                  height={500}
                  alt={movementSummary ? `${movementSummary} movement` : "Watch movement"}
                  className="object-contain w-full h-auto max-w-xs sm:max-w-sm md:max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-12 md:mb-16">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-center">
          Related Products
        </h3>

        <ProductSlider
          items={related.map((r) => ({
            id: r.id,
            slug: r.slug,
            name: r.name,
            meta_title: r.meta_title || r.name,
            price: `৳${Number(r.price || 0).toLocaleString("en-BD")}`,
            discount_price: `৳${Number(r.selling_price || r.discount_price || r.price || 0).toLocaleString("en-BD")}`,
            discount: r.discount ? `${r.discount}% OFF` : "",
            image: r.image || r.thumb_image,
            otherimage: r.otherimage || r.image,
            image2: imgUrl(r.images?.[0]?.multiimage || r.otherimage || r.image),
          }))}
          sliderId="related-products"
        />
      </div>
    </div>
  );
}
