// src/components/ui/OptimizedImage.tsx
import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface OptimizedImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  eager?: boolean;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill";
  // Largeur max en px pour éviter de charger plus grand que nécessaire
  maxWidth?: number;
}

/**
 * Construit une URL Unsplash optimisée avec les bons paramètres.
 * - Format WebP (25-35% plus léger que JPEG)
 * - Qualité réduite intelligemment selon la taille
 * - Fit crop pour les vignettes
 */
export function buildImageUrl(
  src: string,
  width = 800,
  quality?: number,
): string {
  if (!src) return "";

  if (src.includes("unsplash.com")) {
    // Qualité adaptative : moins on demande grand, plus on peut compresser
    const q = quality ?? (width <= 400 ? 55 : width <= 800 ? 65 : 72);
    const url = new URL(
      src.startsWith("http") ? src : `https://images.unsplash.com/${src}`,
    );
    // Retirer les anciens paramètres pour éviter les conflits
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(q));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("fm", "webp"); // WebP partout
    return url.toString();
  }

  return src;
}

/**
 * Génère le srcSet complet pour une image Unsplash
 */
export function buildSrcSet(
  src: string,
  widths = [400, 640, 828, 1080, 1280],
): string {
  if (!src.includes("unsplash.com")) return "";
  return widths.map((w) => `${buildImageUrl(src, w)} ${w}w`).join(", ");
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  fallback = "🌿",
  eager = false,
  aspectRatio = "aspect-square",
  objectFit = "cover",
  maxWidth = 1080,
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(eager);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }, // Précharge 300px avant entrée viewport
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [eager, inView]);

  const fitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  }[objectFit];

  // Widths selon maxWidth de l'image
  const srcSetWidths = [400, 640, 828, 1080].filter((w) => w <= maxWidth + 200);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-stone-100 dark:bg-stone-800",
        aspectRatio,
        className,
      )}
    >
      {/* Shimmer placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-200 to-stone-100 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800 animate-pulse" />
      )}

      {inView && !error && (
        <img
          src={buildImageUrl(src, Math.min(maxWidth, 828))}
          srcSet={buildSrcSet(src, srcSetWidths)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "w-full h-full transition-opacity duration-500",
            fitClass,
            loaded ? "opacity-100" : "opacity-0",
          )}
          {...props}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-6xl">
          {fallback}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
