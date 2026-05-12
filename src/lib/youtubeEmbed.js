/**
 * Build a youtube.com/embed/… URL for an iframe from a watch / shorts / youtu.be link.
 * Returns "" if the URL is missing or not a recognized YouTube link.
 */
export function getYouTubeEmbedFromUrl(url) {
  if (url == null || typeof url !== "string") return "";
  const raw = url.trim();
  if (!raw) return "";
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withScheme);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const shorts = u.pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}`;
      const embed = u.pathname.match(/^\/embed\/([^/?#]+)/);
      if (embed?.[1]) return `https://www.youtube.com/embed/${embed[1]}`;
      const live = u.pathname.match(/^\/live\/([^/?#]+)/);
      if (live?.[1]) return `https://www.youtube.com/embed/${live[1]}`;
    }
  } catch {
    return "";
  }
  return "";
}
