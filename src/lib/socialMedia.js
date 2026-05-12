import { WHATSAPP_CHAT_URL } from "@/config";

/**
 * Storefront social profiles — keep in sync with assets under /public/social-media/.
 */
export const SOCIAL_MEDIA_LINKS = [
  {
    key: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    src: "/social-media/facebook.png",
    linkClassName: "bg-white rounded-full hover:opacity-80 transition-opacity",
    imgClassName: "w-8 h-8",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    src: "/social-media/instagram.png",
    linkClassName: "rounded-full hover:opacity-80 transition-opacity",
    imgClassName: "w-8 h-8",
  },
  {
    key: "x",
    label: "X (Twitter)",
    href: "https://x.com",
    src: "/social-media/x.png",
    linkClassName: "rounded-full hover:opacity-80 transition-opacity",
    imgClassName: "w-8 h-8",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: WHATSAPP_CHAT_URL,
    src: "/social-media/whatsapp.png",
    linkClassName: "rounded-full hover:opacity-80 transition-opacity",
    imgClassName: "w-8 h-8 rounded-full",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://youtube.com",
    src: "/social-media/youtube.jpeg",
    linkClassName: "rounded-full overflow-hidden hover:opacity-80 transition-opacity",
    imgClassName: "h-10 w-auto",
  },
];
