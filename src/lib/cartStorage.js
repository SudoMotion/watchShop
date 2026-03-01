const CART_KEY = "watchshop_cart";

export function getCart() {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(CART_KEY, JSON.stringify(Array.isArray(items) ? items : []));
  } catch (_) {}
}
