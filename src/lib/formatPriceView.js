/** Locale for thousands separators in price UI (comma grouping). */
export const PRICE_DISPLAY_LOCALE = "en-BD";

export function formatNumberGrouped(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0";

  const rounded = Math.round(num);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();

  if (digits.length <= 3) {
    return sign + digits;
  }

  const lastThree = digits.slice(-3);
  let remaining = digits.slice(0, -3);
  const parts = [];

  while (remaining.length > 2) {
    parts.unshift(remaining.slice(-2));
    remaining = remaining.slice(0, -2);
  }

  if (remaining.length > 0) {
    parts.unshift(remaining);
  }

  return sign + parts.join(",") + "," + lastThree;
}

/** Numeric amount as ৳12,345 (view only). */
export function formatTaka(n) {
  return `৳${formatNumberGrouped(n)}`;
}

/** Numeric amount as BDT 12,345 (view only). */
export function formatBdt(n) {
  return `BDT ${formatNumberGrouped(n)}`;
}

/**
 * Parse digits from API/cart strings or numbers. Does not mutate stored data.
 */
export function parsePriceNumber(value) {
  if (value == null || value === "") return NaN;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  let s = String(value).trim();
  s = s.replace(/^BDT\s*/i, "");
  s = s.replace(/^৳\s*/, "");
  s = s.replace(/,/g, "");
  s = s.replace(/\s/g, "");
  if (s === "") return NaN;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Format a price string or number for display with grouping.
 * Preserves ৳ or BDT prefix when present; otherwise uses ৳.
 */
export function formatPriceView(value) {
  if (value == null) return "";
  const raw = String(value).trim();
  if (raw === "") return "";

  const n = parsePriceNumber(value);
  if (!Number.isFinite(n)) return raw;

  const formatted = formatNumberGrouped(n);
  if (/^৳/.test(raw)) return `৳${formatted}`;
  if (/^BDT\s*/i.test(raw)) return `BDT ${formatted}`;
  return `৳${formatted}`;
}
