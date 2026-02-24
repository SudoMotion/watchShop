export function isLoggedIn() {
  if (typeof document === "undefined") return false;
  if (document.cookie.includes("watchshop_logged_in=1")) return true;
  try {
    const raw = localStorage.getItem("watchshop_auth");
    if (!raw) return false;
    const { customer } = JSON.parse(raw);
    return !!(customer && (customer.id != null || customer.phone));
  } catch {
    return false;
  }
}
