import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ShoppingCart,
  MapPin,
  User,
  Minus,
  Plus,
  Package,
  LogIn,
} from "lucide-react";
import { useProduct } from "../hooks/useProducts";
import { useReviews, useDeleteReview } from "../hooks/useReviews";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { BackButton } from "../components/ui/BackButton";
import { Card } from "../components/ui/Card";
import { StarRating } from "../components/ui/StarRating";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/shared/Loader";
import {
  formatPrice,
  imageUrl,
  categoryLabel,
  formatDate,
} from "../utils/helpers";
import { ReviewForm } from "../features/reviews/ReviewForm";

// ✅ Page accessible sans connexion.
// Les actions (panier, avis) demandent la connexion avec un message friendly.

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  const { data: product, isLoading } = useProduct(Number(id));
  const { data: reviewsData } = useReviews({ product: Number(id) });
  const deleteReview = useDeleteReview();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  if (!product) return null;

  const isBuyer = user?.role === "BUYER";

  return (
    <>
      <Helmet>
        <title>{product.name} – AgriConnect</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <BackButton label="Retour au catalogue" />

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800">
              {!imgError ? (
                <img
                  src={imageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl sm:text-8xl">
                  🥬
                </div>
              )}
            </div>
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-stone-700 dark:text-stone-300">
                {categoryLabel[product.category]}
              </span>
            </div>
          </motion.div>

          {/* ── Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 leading-tight">
                {product.name}
              </h1>
              {!product.is_available && (
                <Badge
                  label="Épuisé"
                  className="bg-red-100 text-red-700 ml-4 shrink-0 text-xs"
                />
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              {product.average_rating !== null && product.review_count > 0 ? (
                <>
                  <StarRating value={product.average_rating} size={16} />
                  <span className="text-stone-500 text-xs sm:text-sm">
                    {product.average_rating.toFixed(1)} ({product.review_count}{" "}
                    avis)
                  </span>
                </>
              ) : (
                <span className="text-stone-400 text-xs sm:text-sm">
                  Pas encore d'avis
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs sm:text-sm mb-4 sm:mb-6">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">{product.farmer_name}</span>
              <span>·</span>
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">{product.farmer_location}</span>
            </div>

            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {product.description}
            </p>

            <div className="flex items-center gap-1 text-xs sm:text-sm text-stone-500 mb-4 sm:mb-6">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>
                Stock :{" "}
                <strong
                  className={
                    product.quantity_available < 10
                      ? "text-amber-600"
                      : "text-stone-700 dark:text-stone-300"
                  }
                >
                  {product.quantity_available}
                </strong>{" "}
                unités
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-bold text-green-700 dark:text-green-400 mb-6 sm:mb-8">
              {formatPrice(product.price)}
              <span className="text-xs sm:text-sm font-normal text-stone-400 ml-2">
                par unité
              </span>
            </div>

            {/* ✅ Acheteur connecté → bouton panier */}
            {isBuyer && product.is_available && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Quantité :
                  </span>
                  <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-semibold text-stone-800 dark:text-stone-100 text-sm">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty((q) =>
                          Math.min(product.quantity_available, q + 1),
                        )
                      }
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm text-stone-400">
                    = {formatPrice(Number(product.price) * qty)}
                  </span>
                </div>
                <Button
                  size="lg"
                  onClick={() => addItem(product, qty)}
                  icon={<ShoppingCart className="w-5 h-5" />}
                  className="w-full"
                >
                  Ajouter au panier
                </Button>
              </div>
            )}

            {/* ✅ Visiteur non connecté → invitation à se connecter (friendly) */}
            {!isAuthenticated && product.is_available && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 sm:p-5">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-3">
                  🛒 Vous souhaitez commander ce produit ?
                </p>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 mb-4">
                  Créez un compte gratuitement ou connectez-vous pour ajouter
                  des produits à votre panier.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate("/login", {
                        state: { from: { pathname: `/products/${id}` } },
                      })
                    }
                    icon={<LogIn className="w-4 h-4" />}
                    className="flex-1"
                  >
                    Se connecter
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate("/register?role=BUYER")}
                    className="flex-1"
                  >
                    Créer un compte
                  </Button>
                </div>
              </div>
            )}

            {/* Agriculteur : pas de panier */}
            {isAuthenticated && user?.role === "FARMER" && (
              <p className="text-sm text-stone-400 italic">
                Connecté en tant qu'agriculteur — vous ne pouvez pas commander.
              </p>
            )}
          </motion.div>
        </div>

        {/* ── Reviews ── */}
        <div className="space-y-5 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-100">
            Avis ({reviewsData?.count ?? 0})
          </h2>

          {/* Formulaire avis : acheteurs connectés seulement */}
          {isBuyer && <ReviewForm productId={product.id} />}

          {/* Invitation à se connecter pour laisser un avis */}
          {!isAuthenticated && (
            <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 text-center">
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">
                Vous avez acheté ce produit ? Partagez votre avis.
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  navigate("/login", {
                    state: { from: { pathname: `/products/${id}` } },
                  })
                }
              >
                Se connecter pour laisser un avis
              </Button>
            </div>
          )}

          {/* Liste des avis — visible par tous */}
          {!reviewsData?.results.length ? (
            <p className="text-stone-400 text-center py-6 text-sm">
              Aucun avis pour ce produit.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {reviewsData.results.map((review) => (
                <Card key={review.id} padding="md">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
                        {review.buyer_name}
                      </p>
                      <p className="text-xs text-stone-400">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    {user?.id === review.buyer && (
                      <button
                        onClick={() => deleteReview.mutate(review.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <StarRating value={review.rating} size={13} />
                  {review.comment && (
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
