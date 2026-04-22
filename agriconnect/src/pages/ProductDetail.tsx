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
  Star as StarIcon,
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

const CATEGORY_EMOJI: Record<string, string> = {
  FRUITS: "🍎",
  VEGETABLES: "🥦",
  CEREALS: "🌾",
  MEAT: "🥩",
  DAIRY: "🥛",
  OTHER: "📦",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  // ✅ isLoading ici NE BLOQUE PAS les visiteurs grâce au fix AuthContext
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  const { data: product, isLoading: productLoading } = useProduct(Number(id));
  const { data: reviewsData } = useReviews({ product: Number(id) });
  const deleteReview = useDeleteReview();

  // Spinner seulement pour le chargement du produit (pas de l'auth)
  if (productLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  if (!product) return null;

  const isBuyer = user?.role === "BUYER";
  const isFarmer = user?.role === "FARMER";
  const imgSrc = imageUrl(product.image);
  const fallback = CATEGORY_EMOJI[product.category] || "🌿";

  return (
    <>
      <Helmet>
        <title>{product.name} – AgriConnect</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <BackButton label="Retour au catalogue" />

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 mb-10 sm:mb-14">
          {/* ══ IMAGE ══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 shadow-lg">
              {imgSrc && !imgError ? (
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-7xl sm:text-8xl opacity-60">
                    {fallback}
                  </span>
                </div>
              )}
              {/* Badge catégorie */}
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full text-stone-700 dark:text-stone-200 shadow-sm">
                  {categoryLabel[product.category]}
                </span>
              </div>
              {/* Badge épuisé */}
              {!product.is_available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg">
                    Épuisé
                  </span>
                </div>
              )}
            </div>

            {/* Rating résumé sous l'image sur mobile */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-2 mt-3 lg:hidden">
                <StarRating value={product.average_rating ?? 0} size={14} />
                <span className="text-sm text-stone-500">
                  {(product.average_rating ?? 0).toFixed(1)} ·{" "}
                  {product.review_count} avis
                </span>
              </div>
            )}
          </motion.div>

          {/* ══ INFOS ══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col"
          >
            {/* Nom + badge épuisé desktop */}
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50 leading-tight flex-1">
                {product.name}
              </h1>
              {!product.is_available && (
                <Badge
                  label="Épuisé"
                  className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 shrink-0 text-xs mt-1"
                />
              )}
            </div>

            {/* Rating desktop */}
            <div className="hidden lg:flex items-center gap-2 mb-4">
              {product.review_count > 0 ? (
                <>
                  <StarRating value={product.average_rating ?? 0} size={16} />
                  <span className="text-stone-500 text-sm">
                    {(product.average_rating ?? 0).toFixed(1)}
                    <span className="text-stone-400 ml-1">
                      ({product.review_count} avis)
                    </span>
                  </span>
                </>
              ) : (
                <span className="text-stone-400 text-sm flex items-center gap-1">
                  <StarIcon className="w-4 h-4" /> Aucun avis pour le moment
                </span>
              )}
            </div>

            {/* Farmer */}
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs sm:text-sm mb-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl px-3 py-2.5">
              <User className="w-3.5 h-3.5 shrink-0 text-green-600" />
              <span className="font-medium text-stone-700 dark:text-stone-300">
                {product.farmer_name}
              </span>
              <span className="text-stone-300">·</span>
              <MapPin className="w-3.5 h-3.5 shrink-0 text-green-600" />
              <span>{product.farmer_location}</span>
            </div>

            {/* Description */}
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm mb-2">
              <Package className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="text-stone-500">Stock :</span>
              <span
                className={`font-semibold ${
                  product.quantity_available === 0
                    ? "text-red-600"
                    : product.quantity_available < 10
                      ? "text-amber-600"
                      : "text-green-700 dark:text-green-400"
                }`}
              >
                {product.quantity_available} unités
              </span>
              {product.quantity_available < 10 &&
                product.quantity_available > 0 && (
                  <span className="text-amber-600 text-xs bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                    ⚠ Stock limité
                  </span>
                )}
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-2 my-5 sm:my-6">
              <span className="text-3xl sm:text-4xl font-bold text-green-700 dark:text-green-400">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-stone-400 font-normal">
                / unité
              </span>
            </div>

            {/* ── CTA selon l'état d'auth ── */}

            {/* Cas 1 : Auth en cours de vérification (token existant) */}
            {authLoading && (
              <div className="flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                <Spinner size={20} />
                <span className="text-sm text-stone-500">
                  Vérification du compte…
                </span>
              </div>
            )}

            {/* Cas 2 : Acheteur connecté */}
            {!authLoading && isBuyer && product.is_available && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Quantité :
                  </span>
                  <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-stone-800 dark:text-stone-100">
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
                  <span className="text-sm text-stone-400 font-medium">
                    = {formatPrice(Number(product.price) * qty)}
                  </span>
                </div>
                <Button
                  size="lg"
                  onClick={() => addItem(product, qty)}
                  icon={<ShoppingCart className="w-5 h-5" />}
                  className="w-full shadow-md hover:shadow-lg"
                >
                  Ajouter au panier
                </Button>
              </div>
            )}

            {/* Cas 3 : Visiteur non connecté */}
            {!authLoading && !isAuthenticated && product.is_available && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    Commander ce produit
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 mb-4 leading-relaxed">
                  Créez un compte gratuit ou connectez-vous pour ajouter ce
                  produit à votre panier et passer commande.
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

            {/* Cas 4 : Agriculteur → lecture seule */}
            {!authLoading && isFarmer && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="text-amber-600 text-sm">
                  👨‍🌾 Vous êtes connecté en tant qu'agriculteur.
                </span>
              </div>
            )}

            {/* Cas 5 : Produit épuisé */}
            {product.quantity_available === 0 && (
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-center">
                <p className="text-sm text-stone-500">
                  Ce produit est actuellement épuisé.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ══ AVIS ════════════════════════════════════════════════════════ */}
        <div className="border-t border-stone-100 dark:border-stone-800 pt-8 sm:pt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-amber-400 fill-amber-400" />
            Avis clients
            <span className="text-base font-normal text-stone-400 ml-1">
              ({reviewsData?.count ?? 0})
            </span>
          </h2>

          {/* Formulaire avis — acheteurs connectés */}
          {isBuyer && (
            <div className="mb-6">
              <ReviewForm productId={product.id} />
            </div>
          )}

          {/* Invitation connexion pour avis */}
          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
              <p className="text-sm text-stone-500 dark:text-stone-400 flex-1">
                Vous avez commandé ce produit ? Partagez votre expérience.
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  navigate("/login", {
                    state: { from: { pathname: `/products/${id}` } },
                  })
                }
                className="shrink-0"
              >
                Se connecter pour noter
              </Button>
            </div>
          )}

          {/* Liste des avis — visible par TOUS */}
          {!reviewsData?.results.length ? (
            <div className="text-center py-10 text-stone-400">
              <StarIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Aucun avis pour ce produit.</p>
              <p className="text-xs mt-1">
                Soyez le premier à donner votre avis !
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {reviewsData.results.map((review) => (
                <Card
                  key={review.id}
                  padding="md"
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {review.buyer_name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm leading-none">
                          {review.buyer_name}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
                    {user?.id === review.buyer && (
                      <button
                        onClick={() => deleteReview.mutate(review.id)}
                        className="text-xs text-stone-300 hover:text-red-500 transition-colors"
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
