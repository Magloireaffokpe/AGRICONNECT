// src/features/products/ProductCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, MapPin } from "lucide-react";
import { Product } from "../../types";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { StarRating } from "../../components/ui/StarRating";
import { Badge } from "../../components/ui/Badge";
import { formatPrice, imageUrl, categoryLabel } from "../../utils/helpers";

interface Props {
  product: Product;
}

// Emojis de fallback selon la catégorie
const CATEGORY_EMOJI: Record<string, string> = {
  FRUITS: "🍎",
  VEGETABLES: "🥦",
  CEREALS: "🌾",
  MEAT: "🥩",
  DAIRY: "🥛",
  OTHER: "📦",
};

export const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const isBuyer = user?.role === "BUYER";

  // ✅ Construire l'URL image — imageUrl() gère tous les cas
  const imgSrc = imageUrl(product.image);
  // Emoji fallback si pas d'image ou erreur
  const fallbackEmoji = CATEGORY_EMOJI[product.category] || "🌿";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="card p-0 overflow-hidden group cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-52 bg-stone-100 dark:bg-stone-800 overflow-hidden">
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback emoji quand pas d'image ou erreur de chargement */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700">
            <span className="text-5xl sm:text-6xl opacity-60">
              {fallbackEmoji}
            </span>
          </div>
        )}

        {/* Badge catégorie */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-stone-700 dark:text-stone-300">
            {categoryLabel[product.category] || product.category}
          </span>
        </div>

        {/* Overlay épuisé */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge
              label="Épuisé"
              className="bg-white text-stone-800 text-xs sm:text-sm px-3 py-1"
            />
          </div>
        )}

        {/* Actions au hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white dark:bg-stone-900 rounded-xl shadow-lg flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-green-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>
          {isBuyer && product.is_available && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                addItem(product);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-green-700 rounded-xl shadow-lg flex items-center justify-center text-white hover:bg-green-800 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-stone-800 dark:text-stone-100 leading-snug line-clamp-1 text-sm sm:text-base mb-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-stone-400 mb-2 sm:mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {product.farmer_name} · {product.farmer_location}
          </span>
        </div>

        {product.average_rating !== null && product.review_count > 0 ? (
          <div className="flex items-center gap-1 mb-3 sm:mb-4">
            <StarRating value={product.average_rating} size={12} />
            <span className="text-xs text-stone-400">
              ({product.review_count})
            </span>
          </div>
        ) : (
          <div className="mb-3 sm:mb-4">
            <span className="text-xs text-stone-300 dark:text-stone-600">
              Pas encore d'avis
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-400">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-400 ml-1">/ unité</span>
          </div>
          <span
            className={`text-xs font-medium ${
              product.quantity_available < 10
                ? "text-amber-600 dark:text-amber-400"
                : "text-stone-400"
            }`}
          >
            {product.quantity_available < 10
              ? `⚠ ${product.quantity_available} restants`
              : "En stock"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
