"use client";
import ProductCard2 from "@/component/ProductCard2";
import ProductSlider from "@/component/ProductSlider";
import { NEXT_PUBLIC_API_URL, WHATSAPP_CHAT_URL, WHATSAPP_NUMBER } from "@/config";
import { getProductBySlug } from "@/stores/ProductAPI";
import { getCart, setCart } from "@/lib/cartStorage";
import { getWishlist, setWishlist } from "@/lib/wishlistStorage";
import { getCustomer, isLoggedIn } from "@/lib/auth";
import { submitReview } from "@/stores/ReviewsAPI";
import { buildProductJsonLd } from "@/lib/productMeta";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/component/Loading";
import LoginModal from "@/component/LoginModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatBdt, formatNumberGrouped, formatTaka } from "@/lib/formatPriceView";
import { getYouTubeEmbedFromUrl } from "@/lib/youtubeEmbed";

/** API returns image as filename (e.g. "Fossil_ES4093 (1).webp") or path ("uploads/product/..."). */
const productImagePath = (path) => {
  if (!path || path.startsWith("http")) return path || "";
  return path.includes("/") ? path : `uploads/product/${path}`;
};
const imgUrl = (path) => (path ? `${NEXT_PUBLIC_API_URL}/${productImagePath(path)}` : "");

/** Get first available image from product (tries common API field names). */
const getProductMainImage = (p) => {
  if (!p) return "";
  const fromGallery = p.product_image?.[0]?.multiimage || p.product_image?.[0]?.image || p.product_images?.[0]?.multiimage;
  const fromThumb = p.thumb_image || p.thumbnail || p.thumb || p.image || p.photo;
  return fromGallery || fromThumb || "";
};

/** True if HTML has visible text after stripping tags (for CMS fields). */
function htmlHasBody(html) {
  if (html == null) return false;
  const text = String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return text.length > 0;
}

export default function ProductPageClient({ params }) {
  const router = useRouter();
  const productSlug = params?.productSlug ?? "";
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  /** Selected index in gallery (images + optional YouTube as last item). */
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  /** Show fixed CTA only after scrolling down (keeps inline buttons visible at top). */
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [purchaseQty, setPurchaseQty] = useState(1);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewHoverStar, setReviewHoverStar] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewLoginPromptOpen, setReviewLoginPromptOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const closeReviewModal = useCallback(() => {
    setReviewModalOpen(false);
    setReviewText("");
    setReviewStars(0);
    setReviewHoverStar(0);
  }, []);

  useEffect(() => {
    if (!reviewModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeReviewModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [reviewModalOpen, closeReviewModal]);

  useEffect(() => {
    const getScrollThreshold = () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches
        ? 800
        : 400;

    const updateFloatingCta = () => {
      if (typeof window === "undefined") return;
      setShowFloatingCta(window.scrollY >= getScrollThreshold());
    };

    updateFloatingCta();
    window.addEventListener("scroll", updateFloatingCta, { passive: true });
    window.addEventListener("resize", updateFloatingCta);
    return () => {
      window.removeEventListener("scroll", updateFloatingCta);
      window.removeEventListener("resize", updateFloatingCta);
    };
  }, []);

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    getProductBySlug(productSlug)
      .then((data) => {
        setProductData(data);
        const p = data?.product;
        if (p) {
          setGalleryIndex(0);
          setIsInWishlist(getWishlist().some((item) => item.id === p.id));
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
  const reviewRef = useRef(null);

  const product = productData?.product ?? null;
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const originalPriceNum = toNum(product?.price);
  const discountPriceNum = toNum(product?.discount_price || product?.after_discount_price);
  const sellingPriceRaw = toNum(product?.selling_price);
  const sellingPriceNum =
    discountPriceNum > 0
      ? discountPriceNum
      : sellingPriceRaw > 0
      ? sellingPriceRaw
      : originalPriceNum;
  const apiDiscountPercent = toNum(product?.discount);
  const discountPercent =
    apiDiscountPercent > 0
      ? apiDiscountPercent
      : originalPriceNum > sellingPriceNum && originalPriceNum > 0
      ? ((originalPriceNum - sellingPriceNum) / originalPriceNum) * 100
      : 0;
  const discountPercentText =
    discountPercent > 0
      ? String(Math.round(discountPercent))
      : "0";
  const isEmiAvailable = product?.is_emi_available === "1";
  const stockQty = Math.max(0, toNum(product?.quantity));
  const inStock = stockQty > 0;

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

  const imageUrls = product
    ? [
        imgUrl(getProductMainImage(product)),
        ...(product.product_image || product.productImages || []).map((img) =>
          imgUrl(img?.multiimage || img?.image)
        ).filter(Boolean),
      ].filter(Boolean)
    : [];
  const youtubeEmbedSrc = product?.video_url
    ? getYouTubeEmbedFromUrl(String(product.video_url))
    : "";
  const galleryItems = [
    ...imageUrls.map((src) => ({ type: "image", src })),
    ...(youtubeEmbedSrc ? [{ type: "video", embedUrl: youtubeEmbedSrc }] : []),
  ];
  const thumbGallery =
    galleryItems.length > 0
      ? galleryItems
      : [{ type: "image", src: "/images/mockProduct/1.png" }];

  useEffect(() => {
    if (thumbGallery.length === 0) return;
    setGalleryIndex((i) =>
      Math.min(Math.max(0, i), thumbGallery.length - 1)
    );
  }, [thumbGallery.length, product?.id]);

  const activeGalleryItem = thumbGallery[galleryIndex] ?? thumbGallery[0];
  const authentics = productData?.authentics ?? [];
  const related = productData?.related ?? [];

  const rawReviewList = productData?.reviewList || product?.reviewList || [];
  const reviewList = Array.isArray(rawReviewList)
    ? rawReviewList.map((review) => {
        const rating = Number(review?.rate || 0);
        return {
          id: review?.id,
          name: String(review?.name || "Anonymous"),
          rating: Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0,
          comment: String(review?.review || "").trim(),
          createdAt: review?.created_at,
        };
      })
    : [];
  const totalReviews = reviewList.length;
  const averageRating =
    totalReviews > 0
      ? reviewList.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
  const ratingStarsFilled = totalReviews > 0 ? Math.round(averageRating) : 5;
  const ratingScoreDisplay = totalReviews > 0 ? averageRating : 5;
  const ratingCountDisplay = totalReviews > 0 ? totalReviews : 20;
  const visibleReviews = showAllReviews ? reviewList : reviewList.slice(0, 3);
  const hasMoreReviews = reviewList.length > 3;
  const productItem = productData?.productItem || product?.productItem || [];
  const brand = product?.brand || null;
  const category = product?.category || null;
  const aboutCollectionHtml = product?.about_collection;
  const hasAboutCollection = htmlHasBody(aboutCollectionHtml);
  const collectionImageSrc = product?.collection_image
    ? imgUrl(product.collection_image)
    : "/images/collection.jpg";
  const fallbackCollectionText =
    brand?.meta_description || category?.meta_description || "";
  const movementHtml = product?.movement;
  const hasMovementHtml = htmlHasBody(movementHtml);
  const movementImageSrc = product?.movement_image
    ? imgUrl(product.movement_image)
    : "/images/circular.avif";
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

  /** CMS bullet HTML — render as returned (e.g. `<ul><li>1</li>…</li></ul>`). */
  const bulletHtml =
    product?.bullet_point ??
    product?.bulletPoint ??
    productData?.bullet_point ??
    "";
  const hasBulletPoint = htmlHasBody(bulletHtml);

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
      review: reviewRef,
    };

    const sectionRef = sectionMap[sectionId];
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveTab(sectionId);
    }
  };

  const handleAddToCart = () => {
    if (!product || !inStock) return;
    setAddToCartLoading(true);
    try {
      const slug = product?.slug || productSlug;
      const image = imgUrl(getProductMainImage(product));
      const priceStr = formatTaka(sellingPriceNum);
      const originalPriceStr = formatTaka(originalPriceNum);
      const stock = Number(product?.quantity || 0);
      const cap = Math.max(1, stock);
      const addQty = Math.min(Math.max(1, purchaseQty), cap);
      const newItem = {
        id: product.id,
        image,
        title: product?.name || product?.meta_title || "Product",
        slug,
        brand: product?.brand?.name || "",
        price: priceStr,
        originalPrice: originalPriceStr,
        quantity: addQty,
        stock: cap,
      };
      const cart = getCart();
      const existing = cart.find((item) => item.id === product.id);
      const nextCart = existing
        ? cart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + addQty, item.stock),
                }
              : item
          )
        : [...cart, newItem];
      setCart(nextCart);
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Could not add to cart");
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    try {
      const wishlist = getWishlist();
      if (wishlist.some((item) => item.id === product.id)) {
        setWishlist(wishlist.filter((item) => item.id !== product.id));
        setIsInWishlist(false);
        toast.info("Removed from wishlist");
        return;
      }
      const slug = product?.slug || productSlug;
      const image = imgUrl(getProductMainImage(product));
      const image2 = product?.product_image?.[1]?.multiimage
        ? imgUrl(product.product_image[1].multiimage)
        : image;
      const stock = Number(product?.quantity || 0);
      const newItem = {
        id: product.id,
        image,
        image2,
        title: product?.name || product?.meta_title || "Product",
        slug,
        brand: product?.brand?.name || "",
        price: formatTaka(sellingPriceNum),
        originalPrice: formatTaka(originalPriceNum),
        discount: originalPriceNum > sellingPriceNum
          ? `${Math.round(((originalPriceNum - sellingPriceNum) / originalPriceNum) * 100)}% OFF`
          : "",
        stock,
        inStock: stock > 0,
      };
      setWishlist([...wishlist, newItem]);
      setIsInWishlist(true);
      toast.success("Added to wishlist");
    } catch (err) {
      toast.error("Could not add to wishlist");
    }
  };

  const handleBuyNow = () => {
    if (!product || !inStock || buyNowLoading) return;
    setBuyNowLoading(true);
    try {
      const slug = product?.slug || productSlug;
      const image = imgUrl(getProductMainImage(product));
      const priceStr = formatTaka(sellingPriceNum);
      const originalPriceStr = formatTaka(originalPriceNum);
      const stock = Number(product?.quantity || 0);
      const cap = Math.max(1, stock);
      const addQty = Math.min(Math.max(1, purchaseQty), cap);
      const newItem = {
        id: product.id,
        image,
        title: product?.name || product?.meta_title || "Product",
        slug,
        brand: product?.brand?.name || "",
        price: priceStr,
        originalPrice: originalPriceStr,
        quantity: addQty,
        stock: cap,
      };
      const cart = getCart();
      const existing = cart.find((item) => item.id === product.id);
      const nextCart = existing
        ? cart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + addQty, item.stock),
                }
              : item
          )
        : [...cart, newItem];
      setCart(nextCart);
      router.push("/checkout");
    } finally {
      setBuyNowLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewSubmitting) return;
    if (!isLoggedIn()) {
      setReviewModalOpen(false);
      setReviewLoginPromptOpen(true);
      return;
    }
    const text = String(reviewText || "").trim();
    if (reviewStars < 1 || reviewStars > 5) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!text) {
      toast.error("Please write your review.");
      return;
    }
    const customer = getCustomer();
    const name = String(customer?.name || "").trim();
    const email = String(customer?.email || "").trim();
    const phone = String(customer?.phone ?? "").trim();
    if (!name || !email) {
      toast.error("Customer name/email not found. Please log in first.");
      return;
    }
    const payload = {
      product_id: product?.id,
      rate: reviewStars,
      customer_id: customer?.id ?? null,
      name,
      email,
      phone,
      review: text,
    };
    setReviewSubmitting(true);
    try {
      const response = await submitReview(payload);
      if (response?.status >= 200 && response?.status < 300) {
        toast.success(response?.data?.message || "Thank you! Your review has been submitted.");
        closeReviewModal();
      } else {
        const msg =
          response?.data?.message ||
          response?.data?.error ||
          "Could not submit your review. Please try again.";
        toast.error(msg);
      }
    } catch {
      toast.error("Could not submit your review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleOpenReview = () => {
    if (!isLoggedIn()) {
      setReviewLoginPromptOpen(true);
      return;
    }
    setReviewModalOpen(true);
  };

  // Detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "editor-note", ref: editorNoteRef },
        { id: "specification", ref: specificationRef },
        { id: "collection", ref: collectionRef },
        { id: "movement", ref: movementRef },
        { id: "review", ref: reviewRef },
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

  useEffect(() => {
    setPurchaseQty(1);
  }, [productSlug]);

  useEffect(() => {
    if (stockQty < 1) return;
    setPurchaseQty((q) => Math.min(Math.max(1, q), stockQty));
  }, [stockQty]);

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (!productData && !loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-white">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }
  const productJsonLd = product ? buildProductJsonLd(product, productSlug) : null;

  const cat = product?.category;
  const brandObj = product?.brand;
  const categorySlug =
    cat?.slug != null && String(cat.slug).trim() !== "" ? String(cat.slug).trim() : "";
  const categoryId =
    cat?.id != null && cat.id !== "" ? String(cat.id) : "";
  const categoryHref =
    categorySlug !== ""
      ? `/category/${categorySlug}${
          categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : ""
        }`
      : "/";
  const brandSlug =
    brandObj?.slug != null && String(brandObj.slug).trim() !== ""
      ? String(brandObj.slug).trim()
      : "";
  const brandHref = brandSlug !== "" ? `/brand/${brandSlug}` : "/";

  return (
    <div
      className={`w-full bg-white text-gray-800 ${
        showFloatingCta ? "pb-14 sm:pb-16" : ""
      }`}
    >
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
        />
      ) : null}

      {/* CONTAINER */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">

        {/* LEFT: IMAGES */}
        <div className="order-1 lg:order-1">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 w-full min-w-0 break-words"
          >
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
                aria-hidden
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span>Home</span>
            </Link>
            <span className="mx-1 inline select-none" aria-hidden>
              /
            </span>
            <Link
              href={categoryHref}
              className="inline-flex shrink-0 items-center gap-2 font-semibold"
            >
              <span>{cat?.name ?? "Category"}</span>
            </Link>
            <span className="mx-1 inline select-none" aria-hidden>
              /
            </span>
            <Link
              href={brandHref}
              className="inline-flex shrink-0 items-center gap-2 font-semibold"
            >
              <span>{brandObj?.name ?? "Brand"}</span>
            </Link>
            <span className="mx-1 inline select-none" aria-hidden>
              /
            </span>
            <span className="inline min-w-0" title={product?.name}>
              {product?.name}
            </span>
          </nav>
          <div className="relative aspect-square w-full border rounded-xl bg-gray-50 overflow-hidden">
            {activeGalleryItem ? (
              <>
                {activeGalleryItem.type === "video" ? (
                  <iframe
                    title="Product video"
                    src={activeGalleryItem.embedUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <Image
                    src={activeGalleryItem.src}
                    fill
                    alt={
                      product?.name ||
                      product?.meta_title ||
                      product?.on_page_meta_title ||
                      "Product image"
                    }
                    className="object-cover"
                    unoptimized
                  />
                )}
                {!inStock ? (
                  <div className="pointer-events-none absolute right-3 top-3 z-10 max-w-[calc(100%-1.5rem)]">
                    <span className="inline-block rounded-full bg-black px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-amber-400 shadow-lg">
                      Out of stock
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md ring-1 ring-black/10 transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                      isInWishlist
                        ? "bg-red-50 text-red-600"
                        : "bg-white/95 text-gray-700 hover:bg-white"
                    }`}
                    aria-label={
                      isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                    title={
                      isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    {isInWishlist ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                        aria-hidden
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.003.001a.75.75 0 01-.704 0l-.003-.001z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.75}
                        stroke="currentColor"
                        className="h-5 w-5"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </>
            ) : (
              <div className="w-full max-w-md h-64 flex items-center justify-center text-gray-400">No image</div>
            )}
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
                {thumbGallery.map((item, i) => (
                <button
                    key={item.type === "video" ? "video-thumb" : `${item.src}-${i}`}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`border rounded-lg p-1.5 sm:p-2 min-w-[60px] sm:min-w-[70px] md:min-w-20 flex-shrink-0 ${
                    galleryIndex === i ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-label={item.type === "video" ? "Product video" : "Product image thumbnail"}
                >
                    {item.type === "video" ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-900 sm:h-16 sm:w-16 md:h-20 md:w-20">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white sm:h-8 sm:w-8" fill="currentColor" aria-hidden>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                    <Image
                    src={item.src}
                    width={90}
                    height={90}
                    alt=""
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                    />
                    )}
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

          <div className="mt-2 sm:mt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center text-amber-500 text-base sm:text-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= ratingStarsFilled ? "text-amber-500" : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm sm:text-base text-gray-600">
              {ratingScoreDisplay.toFixed(1)}{" "}
              <button
                type="button"
                onClick={() => scrollToSection("review")}
                className="cursor-pointer rounded underline-offset-2 transition-colors hover:text-gray-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                aria-label="Jump to customer reviews"
              >
                ({ratingCountDisplay}{" "}
                {ratingCountDisplay === 1 ? "review" : "reviews"})
              </button>
            </span>
          </div>

          <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-2 sm:gap-3">
            {sellingPriceNum > 0 && (
              <span className="text-red-600 font-bold text-lg sm:text-xl md:text-2xl">
                {formatBdt(sellingPriceNum)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-sm sm:text-base font-medium text-red-700">
                {discountPercentText}% off
              </span>
            )}
            {originalPriceNum > 0 && originalPriceNum > sellingPriceNum && (
              <del className="text-sm sm:text-base text-gray-500">
                {formatBdt(originalPriceNum)}
              </del>
            )}
          </div>


          {/* EMI Section */}
          {isEmiAvailable && (
            <div className="mt-2 sm:mt-3 inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg border border-indigo-100/80 bg-gradient-to-br from-blue-50 to-indigo-50 px-2.5 py-1.5 sm:px-3 sm:py-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-800">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500 animate-pulse" aria-hidden />
                EMI Available
              </span>
              <Link
                href="/emi"
                className="text-[11px] sm:text-xs font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
              >
                View plan
              </Link>
            </div>
          )}

          {/* Inline Add to Cart & Buy Now — fixed bar appears after 500px scroll */}
          

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
              {hasBulletPoint ? (
                <div className="mt-1 md:mt-3">
                  {modelText ? (
                    <ul className="mb-2 space-y-1.5 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-black">●</span>
                        <span>
                          <span className="font-medium text-gray-800">Model:</span>{" "}
                          <span className="text-gray-600">{modelText}</span>
                        </span>
                      </li>
                    </ul>
                  ) : null}
                  <div
                    className="product-bullet-point text-sm leading-relaxed text-gray-700 [&_ul]:my-0 [&_ul]:list-none [&_ul]:space-y-1.5 [&_ul]:pl-0 [&_ol]:my-0 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:before:mt-0.5 [&_li]:before:shrink-0 [&_li]:before:text-black [&_li]:before:content-['●'] [&_li]:before:font-normal [&_p]:my-1"
                    dangerouslySetInnerHTML={{ __html: String(bulletHtml) }}
                  />
                </div>
              ) : (
                <ul className="mt-1 space-y-1.5 text-sm text-gray-700 md:mt-3">
                  {modelText ? (
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-black">●</span>
                      <span>
                        <span className="font-medium text-gray-800">Model:</span>{" "}
                        <span className="text-gray-600">{modelText}</span>
                      </span>
                    </li>
                  ) : null}
                  {productItem
                    .filter(
                      (item) =>
                        item?.value != null &&
                        String(item.value).trim() !== "" &&
                        String(item?.label || "").trim().toLowerCase() !== "model"
                    )
                    .slice(0, 6)
                    .map((item) => (
                      <li key={item.id ?? item.label} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-black">●</span>
                        <span>
                          <span className="font-medium text-gray-800">{item.label}:</span>{" "}
                          <span className="text-gray-600">{item.value}</span>
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            {inStock && (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
                
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-300 bg-white shadow-sm">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={purchaseQty <= 1}
                      onClick={() => setPurchaseQty((q) => Math.max(1, q - 1))}
                      className="flex h-7 w-7 shrink-0 items-center justify-center text-sm font-semibold leading-none text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8 sm:text-base"
                    >
                      −
                    </button>
                    <span className="min-w-7 select-none px-1 text-center text-xs font-semibold tabular-nums text-gray-900 sm:min-w-8 sm:px-1.5 sm:text-sm">
                      {purchaseQty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={purchaseQty >= stockQty}
                      onClick={() =>
                        setPurchaseQty((q) => Math.min(stockQty, q + 1))
                      }
                      className="flex h-7 w-7 shrink-0 items-center justify-center text-sm font-semibold leading-none text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8 sm:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-green-600">in stock: </span>{" "}
                  {formatNumberGrouped(stockQty)}
                </p>
              </div>
            )}
          <div
            className={`flex flex-wrap items-center gap-3 ${inStock ? "mt-3 sm:mt-4" : "mt-4 sm:mt-5"}`}
          >
            {inStock ? (
              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addToCartLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-black px-5 py-2.5 font-semibold text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  <span>{addToCartLoading ? "Adding..." : "Add to Cart"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={buyNowLoading}
                  className="rounded-lg cursor-pointer bg-sky-400 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {buyNowLoading ? "Processing..." : "Buy Now"}
                </button>
              </>
            ) : (
              <span className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                Out of stock
              </span>
            )}
          </div>

          {/* SPECS */}
          <div className="mt-2 md:mt-4">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
              To speak an Expert 24/7
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
            Contact Us Now
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 font-medium text-white overflow-hidden rounded-full shadow-md transition-transform hover:scale-105"
                aria-label="Chat on WhatsApp with our support team"
              >
                WhatsApp
              </a>
              <span>{WHATSAPP_NUMBER}</span>
            </div>
            <div className="grid grid-cols-2 bg-black gap-px text-center my-5 mb-5 w-full md:w-2/3 border border-black">
              {authentics.length > 0
                ? authentics.map((a) => (
                    <div key={a.id} className="flex flex-col items-center bg-white p-2">
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
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-6 sm:mt-8">
      
        <div className="z-30 flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 sticky top-[50px] md:top-[70px] bg-white shadow-md px-2 sm:px-3 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
            <button
              onClick={() => scrollToSection("review")}
              className={`py-2 px-1 sm:px-2 whitespace-nowrap font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-colors flex-shrink-0 ${
                activeTab === "review"
                  ? "border-b-2 border-red-600 text-black"
                  : "border-b-2 border-transparent text-gray-600 hover:text-black"
              }`}
            >
              REVIEW
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

                {hasAboutCollection ? (
                  <div
                    className="mb-4 text-xs leading-relaxed text-gray-700 sm:mb-6 sm:text-sm prose prose-sm max-w-none [&_img]:h-auto [&_img]:max-w-full"
                    dangerouslySetInnerHTML={{
                      __html: String(aboutCollectionHtml),
                    }}
                  />
                ) : fallbackCollectionText ? (
                  <p className="text-xs sm:text-sm mb-4 sm:mb-6">
                    {fallbackCollectionText}
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
                  src={collectionImageSrc}
                  width={600}
                  height={800}
                  alt={brand?.name ? `${brand.name} collection` : "Watch collection"}
                  className="rounded-lg object-cover w-full h-auto"
                  unoptimized={Boolean(product?.collection_image)}
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

                {hasMovementHtml ? (
                  <div
                    className="mb-4 text-xs leading-relaxed text-gray-700 sm:mb-6 sm:text-sm prose prose-sm max-w-none [&_img]:h-auto [&_img]:max-w-full"
                    dangerouslySetInnerHTML={{
                      __html: String(movementHtml),
                    }}
                  />
                ) : null}

                {movementSpecs.length > 0 ? (
                  <>
                    {movementSummary && (
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        This watch features a {movementSummary} movement with the following key
                        specifications:
                      </p>
                    )}

                    {/* SPECS GRID */}
                    {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 sm:gap-y-6 md:gap-y-8 gap-x-4 sm:gap-x-6 md:gap-x-10 mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-gray-700">
                      {movementSpecs.map((spec) => (
                        <div key={spec.id}>
                          <p className="text-gray-400">{spec.label}</p>
                          <p className="font-medium">{spec.value || "-"}</p>
                        </div>
                      ))}
                    </div> */}
                  </>
                ) : !hasMovementHtml ? (
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Movement information is not available for this product.
                  </p>
                ) : null}
              </div>

              {/* RIGHT IMAGE */}
              <div className="flex justify-center order-1 lg:order-2">
                <Image
                  src={movementImageSrc}
                  width={500}
                  height={500}
                  alt={movementSummary ? `${movementSummary} movement` : "Watch movement"}
                  className="object-contain w-full h-auto max-w-xs sm:max-w-sm md:max-w-md"
                  unoptimized={Boolean(product?.movement_image)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-12 md:mb-16">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-center">
            Related Products
          </h3>

          <ProductSlider
            items={related.map((r) => ({
              id: r.id,
              slug: r.slug,
              name: r.name,
              meta_title: r.meta_title || r.name,
              price: formatTaka(Number(r.price || 0)),
              discount_price: formatTaka(
                Number(r.selling_price || r.discount_price || r.price || 0)
              ),
              discount: toNum(r.discount) > 0 ? `${Math.round(toNum(r.discount))}% OFF` : "",
              image: r.image || r.thumb_image,
              otherimage: r.otherimage || r.image,
              image2: imgUrl(r.images?.[0]?.multiimage || r.otherimage || r.image),
            }))}
            sliderId="related-products"
          />
        </div>

        {/* REVIEWS */}
        <div
          id="review"
          ref={reviewRef}
          className="scroll-mt-[120px] mt-6 sm:mt-8 md:mt-10"
        >
        <h3 className="mb-4 text-center text-base sm:mb-5 sm:text-lg md:text-xl font-semibold">
          Customer Reviews
        </h3>
        <div className="space-y-4 sm:space-y-5">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <span className="font-medium text-gray-900">{review.name}</span>
                <span className="flex items-center gap-0.5 text-amber-500" title={`${review.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= review.rating ? "text-amber-500" : "text-gray-300"}>
                      {star <= review.rating ? "★" : "☆"}
                    </span>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({review.rating})</span>
                </span>
                {review.createdAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{review.comment}</p>
            </div>
          ))}
          {visibleReviews.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-5 text-center text-sm text-gray-600 sm:text-base">
              No reviews yet. Be the first to write a review.
            </div>
          )}
        </div>
        {!showAllReviews && hasMoreReviews && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllReviews(true)}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Show more reviews
            </button>
          </div>
        )}
        <div className="mt-8 flex justify-center sm:mt-10">
          <button
            type="button"
            onClick={handleOpenReview}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Write a review
          </button>
        </div>
        </div>
      </div>

      {/* Fixed CTA — only after scrolling 500px (inline buttons stay at top) */}
      {showFloatingCta && inStock && (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 pb-[max(0.2rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none">
          <div className="pointer-events-auto flex w-full max-w-2/3 md:max-w-[min(100%,26rem)] items-center gap-1.5 rounded-xl border border-gray-200/90 bg-white/98 px-2 py-1.5 shadow-md backdrop-blur-sm">
            
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock || addToCartLoading}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-black px-2 py-1.5 text-[11px] font-medium leading-tight text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="truncate">{addToCartLoading ? "Adding..." : "Add to Cart"}</span>
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!inStock || buyNowLoading}
              className="min-w-0 flex-1 rounded-lg bg-sky-500 px-2 py-1.5 text-[11px] font-medium leading-tight text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
            >
              <span className="truncate">{buyNowLoading ? "Processing..." : "Buy Now"}</span>
            </button>
            {/* <div className="inline-flex shrink-0 items-center overflow-hidden rounded-full border border-gray-300 bg-gray-50">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={purchaseQty <= 1}
                onClick={() => setPurchaseQty((q) => Math.max(1, q - 1))}
                className="flex h-7 w-7 shrink-0 items-center justify-center text-sm font-semibold leading-none text-gray-800 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-7 select-none px-1 text-center text-[11px] font-semibold tabular-nums text-gray-900">
                {purchaseQty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={purchaseQty >= stockQty}
                onClick={() => setPurchaseQty((q) => Math.min(stockQty, q + 1))}
                className="flex h-7 w-7 shrink-0 items-center justify-center text-sm font-semibold leading-none text-gray-800 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div> */}
          </div>
        </div>
      )}

      {/* Write a review modal */}
      {reviewModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={closeReviewModal}
            aria-label="Close review form"
          />
          <div
            className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h4
                id="review-modal-title"
                className="text-lg font-semibold text-gray-900 sm:text-xl"
              >
                Write a review
              </h4>
              <button
                type="button"
                onClick={closeReviewModal}
                className="rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close"
              >
                <span className="text-2xl leading-none" aria-hidden>
                  ×
                </span>
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Your rating <span className="text-red-500">*</span>
                </span>
                <div
                  className="flex flex-wrap items-center gap-1"
                  role="radiogroup"
                  aria-label="Star rating"
                >
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active =
                      n <=
                      (reviewHoverStar > 0 ? reviewHoverStar : reviewStars);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewStars(n)}
                        onMouseEnter={() => setReviewHoverStar(n)}
                        onMouseLeave={() => setReviewHoverStar(0)}
                        className="rounded p-0.5 text-2xl leading-none text-amber-400 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        aria-pressed={reviewStars === n}
                      >
                        {active ? "★" : "☆"}
                      </button>
                    );
                  })}
                  {reviewStars > 0 && (
                    <span className="ml-1 text-sm text-gray-600">
                      ({reviewStars}/5)
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="review-text"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Your review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review-text"
                  name="review"
                  rows={4}
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  disabled={reviewSubmitting}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LoginModal
        open={reviewLoginPromptOpen}
        onClose={() => setReviewLoginPromptOpen(false)}
        onSuccess={() => {
          setReviewModalOpen(true);
        }}
        title="Sign in to review"
        description="Enter your mobile number to receive a code. After you sign in, you can submit your review."
      />

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}
