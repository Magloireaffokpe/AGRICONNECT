// src/utils/helpers.ts

export const formatPrice = (price: string | number, currency = "FCFA") =>
  `${Number(price).toLocaleString("fr-FR")} ${currency}`;

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const categoryLabel: Record<string, string> = {
  FRUITS: "🍎 Fruits",
  VEGETABLES: "🥦 Légumes",
  CEREALS: "🌾 Céréales",
  MEAT: "🥩 Viande",
  DAIRY: "🥛 Produits laitiers",
  OTHER: "📦 Autre",
};

export const statusLabel: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const statusColor: Record<string, string> = {
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DELIVERED:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  IN_TRANSIT:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

/**
 * Construit une URL image valide depuis n'importe quelle source.
 *
 * Cas gérés :
 *  1. null / vide                          → chaîne vide (le composant affichera le fallback emoji)
 *  2. URL Cloudinary correcte              → retournée telle quelle
 *  3. URL Cloudinary SANS /image/upload/   → corrigée automatiquement
 *  4. URL relative /media/xxx              → préfixée avec VITE_API_BASE_URL
 *  5. URL Unsplash                         → optimisée avec WebP + taille réduite
 */
export const imageUrl = (path: string | null | undefined): string => {
  if (!path) return "";

  // ── URL Cloudinary correcte (contient /image/upload/) ──────────────
  if (path.includes("res.cloudinary.com") && path.includes("/image/upload/")) {
    return path;
  }

  // ── URL Cloudinary SANS /image/upload/ — bug connu ──────────────────
  // Ex: https://res.cloudinary.com/dzmp00qcw/products/mais.webp
  //  → https://res.cloudinary.com/dzmp00qcw/image/upload/products/mais.webp
  if (path.includes("res.cloudinary.com") && !path.includes("/image/upload/")) {
    return path.replace(
      /res\.cloudinary\.com\/([^/]+)\//,
      "res.cloudinary.com/$1/image/upload/",
    );
  }

  // ── URL Unsplash — optimiser ─────────────────────────────────────────
  if (path.includes("unsplash.com")) {
    try {
      const url = new URL(path);
      url.searchParams.set("w", "600");
      url.searchParams.set("q", "70");
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("fm", "webp");
      return url.toString();
    } catch {
      return path;
    }
  }

  // ── URL déjà absolue (autre CDN) ─────────────────────────────────────
  if (path.startsWith("http")) return path;

  // ── Chemin relatif /media/xxx → backend Django ───────────────────────
  const base = import.meta.env.VITE_API_BASE_URL || "";
  // En dev avec proxy Vite, base = '' et /media/ est proxifié
  // En prod, base = URL du backend Render
  if (path.startsWith("/")) return `${base}${path}`;
  return `${base}/media/${path}`;
};

export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const checkPasswordStrength = (password: string) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  digit: /[0-9]/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});
