"use client";
import ProductCard2 from "@/component/ProductCard2";
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
  const priceNum = Number(product?.selling_price || product?.price || 0);
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
  const emi3Months = calculateEMI(priceNum, 3);
  const emi6Months = calculateEMI(priceNum, 6);

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
  const productItem = product?.productItem ?? [];

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
            Product Title Goes Here
          </h1>

          <div className="mt-2 sm:mt-3">
            <span className="line-through text-xs sm:text-sm mr-2 sm:mr-3">৳56,000.00</span>
            <span className="text-red-600 font-bold text-base sm:text-lg md:text-xl">৳42,000.00</span>
          </div>

          <p className="text-xs sm:text-sm mt-1">Model: XXXXX</p>

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

          {/* SPECS */}
          <div className="mt-6 sm:mt-8 border rounded-xl p-3 sm:p-4 md:p-5">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">To speak an Expert 24/7</h2>
            <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">WhatsApp us at +8801000000000</h2>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
                  ABOUT THE JACOB & CO. EPIC X COLLECTION
                </h2>

                <p className="text-xs sm:text-sm mb-4 sm:mb-6">
                  The Epic X collection, launched in 2015, quickly became a hallmark of Jacob & Co.'s
                  innovative spirit and bold design. Defined by the striking "X" motif, which
                  symbolises mystery and allure, the collection reflects their daring approach to
                  contemporary watchmaking. By 2022, the Epic X underwent a significant transformation
                  at Geneva Watch Days, introducing new materials and refined craftsmanship across five
                  distinct versions. With its iconic X-shaped lugs and skeletonised dials, the Epic X
                  perfectly balances elegance and innovation, showcasing the brand's commitment to
                  luxury watchmaking.
                </p>

                <h3 className="text-sm sm:text-base font-semibold mb-1">
                  Timeless Designs And Precision Engineering
                </h3>

                <p className="text-xs sm:text-sm mb-4 sm:mb-6">
                  The 2022 Epic X collection retains its signature X-shaped case, with angular lugs
                  that seamlessly integrate into the bezel for a refined, cohesive design. The
                  high-polished stainless steel and rose gold versions exude luxury, while the stainless
                  steel model features blue aluminium accents on the inner bezel, bridges, and crown
                  base. A newly designed five-link bracelet with angular profiles adds to its modern
                  appeal. All Epic X models share common specifications, including a 44mm case diameter
                  and a thickness of 13.05mm. Powered by the hand-wound calibre JCAM45, recognised for
                  its skeletonised vertical construction, the collection operates at 28,800 vph with a
                  48-hour power reserve. The 2022 update introduces Clous de Paris-textured bridges and
                  redesigned crown guards, elevating the collection's sophistication.
                </p>

                <h3 className="text-sm sm:text-base font-semibold mb-1">
                  Honouring Heritage: The Epic X India Edition
                </h3>

                <p className="text-xs sm:text-sm">
                  India holds significant promise for Jacob & Co., inspiring the brand to create
                  exclusive limited editions in collaboration with Ethos. The Epic X India Edition
                  showcases four iconic monuments — Taj Mahal, India Gate, Gateway of India, and Qutub
                  Minar — in intricate 2D titanium designs, honouring Indian heritage. Further
                  enriching its thematic offerings, Jacob & Co. introduced two exclusive Ram
                  Janmabhoomi editions, incorporating distinctive cultural motifs and historical
                  significance. In October 2024, Jacob & Co. elevated the collection with the Wonders
                  of India, replacing the Gateway of India with the Ram Mandir, an emblem of India's
                  diverse heritage and the brand's dedication to authentic cultural representation.
                </p>
              </div>

              {/* RIGHT IMAGE */}
              <div className="w-full order-1 lg:order-2">
                <Image
                  src="/images/collection.jpg"   // update path to your image
                  width={600}
                  height={800}
                  alt="Jacob & Co Epic X Watch"
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

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  The calibre JCAM45 is an in-house movement created by Jacob & Co. specifically
                  for their Epic X Bridges watches. It features a highly skeletonised design with
                  a vertical structure to provide maximum transparency. In lieu of a traditional
                  mainplate, the entire movement is suspended on two vertical bridges, which are
                  finished with a Clou de Paris pattern. This is a manual winding movement that
                  operates at 28,800 vibrations per hour, consists of 158 components and 21 jewels,
                  and displays hours and minutes. It is equipped with an open-worked barrel that
                  provides a power reserve of 48 hours. The Calibre JCAM45 is meticulously finished,
                  with components featuring bevelled edges and a combination of polished and matte
                  finishes.
                </p>

                {/* SPECS GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 sm:gap-y-6 md:gap-y-8 gap-x-4 sm:gap-x-6 md:gap-x-10 mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm text-gray-700">

                  <div>
                    <p className="text-gray-400">Brand</p>
                    <p className="font-medium">Jacob & Co.</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Reference</p>
                    <p className="font-medium">JCAM45</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Movement</p>
                    <p className="font-medium">Manual Winding</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Power Reserve</p>
                    <p className="font-medium">Approx. 48 hours</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Jewels</p>
                    <p className="font-medium">21</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Frequency</p>
                    <p className="font-medium">28,800 bph</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Display</p>
                    <p className="font-medium">Analog</p>
                  </div>

                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="flex justify-center order-1 lg:order-2">
                <Image
                  src="/images/circular.avif"  // update path
                  width={500}
                  height={500}
                  alt="Watch Movement"
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {related.map((r) => (
            <ProductCard2
              key={r.id}
              item={{
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
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
