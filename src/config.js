export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.watchshopbd.com';
export const Backend_Base_Url = process.env.NEXT_PUBLIC_API_URL || 'https://backend.watchshopbd.com';

/** Public storefront URL — canonical URLs & JSON-LD (set NEXT_PUBLIC_SITE_URL in env). */
export const SITE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")) ||
  "https://watchshopbd.com";

/** WhatsApp chat link for floating button & CTAs (override via NEXT_PUBLIC_WHATSAPP_URL). */
export const WHATSAPP_CHAT_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/8801939418800';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+88 01939418800';