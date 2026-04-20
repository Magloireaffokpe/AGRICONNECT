// src/components/ui/OptimizedImage.tsx
// Composant image avec :
// - Placeholder blur pendant le chargement
// - Lazy loading natif + Intersection Observer
// - Tailles responsives automatiques
// - Fallback si erreur
// - Support WebP via Unsplash API params

import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface OptimizedImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string; // emoji ou URL de secours
  eager?: boolean; // charger immédiatement (above the fold)
  aspectRatio?: string; // ex: 'aspect-square', 'aspect-video', 'aspect-[4/3]'
  objectFit?: "cover" | "contain" | "fill";
}

/**
 * Construit une URL Unsplash optimisée avec les bons paramètres
 * Si l'URL n'est pas Unsplash, la retourne telle quelle
 */
export function buildImageUrl(
  src: string,
  width = 800,
  quality = 75,
  format = "webp",
): string {
  if (!src) return "";

  // Images Unsplash : on ajoute/remplace les paramètres d'optimisation
  if (src.includes("unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("fm", format);
    return url.toString();
  }

  // Images backend Django : retournées telles quelles
  return src;
}

/**
 * Génère un placeholder SVG flou en base64 (évite un appel réseau)
 */
function getBlurPlaceholder(color = "#d4edda"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <filter id="blur"><feGaussianBlur stdDeviation="20"/></filter>
    <rect width="100%" height="100%" fill="${color}" filter="url(#blur)"/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  fallback = "🌿",
  eager = false,
  aspectRatio = "aspect-square",
  objectFit = "cover",
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(eager);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection Observer pour lazy loading
  useEffect(() => {
    if (eager || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }, // Précharge 200px avant d'entrer dans le viewport
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [eager, inView]);

  const fitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  }[objectFit];

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-stone-100 dark:bg-stone-800",
        aspectRatio,
        className,
      )}
    >
      {/* Placeholder pendant le chargement */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700" />
      )}

      {/* Image principale — ne se charge que quand elle est dans le viewport */}
      {inView && !error && (
        <img
          src={buildImageUrl(src, 900, 80)}
          srcSet={[
            `${buildImageUrl(src, 400, 75)} 400w`,
            `${buildImageUrl(src, 700, 78)} 700w`,
            `${buildImageUrl(src, 1000, 80)} 1000w`,
            `${buildImageUrl(src, 1400, 82)} 1400w`,
          ].join(", ")}
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

      {/* Fallback emoji si erreur */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-6xl">
          {fallback}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
