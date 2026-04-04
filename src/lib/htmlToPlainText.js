/**
 * Plain text for card excerpts. Rich HTML + Tailwind line-clamp on one node breaks
 * (nested blocks overlap). Same output on server and client.
 */
export function htmlToPlainText(html) {
  if (html == null || html === '') return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
