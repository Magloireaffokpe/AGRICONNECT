import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useCreateOrder } from "../hooks/useOrders";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/shared/EmptyState";
import { formatPrice, imageUrl } from "../utils/helpers";

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState<
    "HOME_DELIVERY" | "PICKUP_POINT"
  >("HOME_DELIVERY");
  const [deliveryAddress, setDeliveryAddress] = useState<string>(""); // ✅ initialisation explicite
  const [addressError, setAddressError] = useState("");

  const handleOrder = async () => {
    console.log("handleOrder appelé, deliveryAddress:", deliveryAddress);
    if (
      deliveryType === "HOME_DELIVERY" &&
      (!deliveryAddress || !deliveryAddress.trim())
    ) {
      setAddressError("Veuillez sélectionner une adresse de livraison");
      return;
    }
    setAddressError("");
    await createOrder.mutateAsync({
      delivery_type: deliveryType,
      delivery_address: deliveryType === "HOME_DELIVERY" ? deliveryAddress : "",
      items: items.map((i) => ({
        product: i.product.id,
        quantity: i.quantity,
      })),
    });
    clearCart();
    navigate("/my-orders");
  };

  const handleLocationSelect = (location: any) => {
    console.log("Location selected:", location);
    // Extrait l'adresse formatée (certains composants utilisent name, d'autres formatted_address)
    const address = location?.name || location?.formatted_address || "";
    setDeliveryAddress(address);
    setAddressError("");
  };

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <EmptyState
          icon="🛒"
          title="Votre panier est vide"
          description="Parcourez notre catalogue et ajoutez des produits à votre panier."
          action={{
            label: "Découvrir le catalogue",
            onClick: () => navigate("/products"),
          }}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mon panier – AgriConnect</title>
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="w-7 h-7 text-green-700 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
              Mon panier
            </h1>
            <span className="ml-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
              {totalItems} article{totalItems > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Liste des produits */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card padding="sm">
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                          <img
                            src={imageUrl(item.product.image)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-stone-800 dark:text-stone-100 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-stone-500 dark:text-stone-400">
                            {item.product.farmer_name}
                          </p>
                          <p className="text-green-700 dark:text-green-400 font-semibold mt-1">
                            {formatPrice(item.product.price)} / unité
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-xl p-1 shrink-0">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-stone-700 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >= item.product.quantity_available
                            }
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-stone-700 transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right shrink-0 min-w-[80px]">
                          <p className="font-bold text-stone-800 dark:text-stone-100">
                            {formatPrice(
                              Number(item.product.price) * item.quantity,
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <Card padding="lg" className="sticky top-24">
                <h2 className="font-bold text-stone-800 dark:text-stone-100 text-lg mb-5">
                  Résumé
                </h2>

                <div className="space-y-2 mb-5">
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Mode de livraison :
                  </p>
                  {[
                    {
                      value: "HOME_DELIVERY",
                      label: "🚚 Livraison à domicile",
                    },
                    { value: "PICKUP_POINT", label: "🏪 Retrait sur place" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setDeliveryType(opt.value as typeof deliveryType)
                      }
                      className={`w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        deliveryType === opt.value
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {deliveryType === "HOME_DELIVERY" && (
                  <div className="mb-5">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1">
                      Adresse de livraison *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Ex: 123 Rue de la Paix, Parakou"
                      className="w-full rounded-xl border border-stone-200 dark:border-stone-700 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                    {addressError && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressError}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex justify-between text-stone-500 dark:text-stone-400">
                    <span>Sous-total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 dark:text-stone-400">
                    <span>Livraison</span>
                    <span className="text-green-600 font-medium">Gratuite</span>
                  </div>
                  <hr className="border-stone-100 dark:border-stone-800 my-2" />
                  <div className="flex justify-between font-bold text-stone-800 dark:text-stone-100 text-base">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  loading={createOrder.isPending}
                  onClick={handleOrder}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Commander
                </Button>

                <button
                  onClick={clearCart}
                  className="w-full mt-3 text-xs text-stone-400 hover:text-red-500 transition-colors"
                >
                  Vider le panier
                </button>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
