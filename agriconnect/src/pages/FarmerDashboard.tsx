import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Star,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMyProducts } from "../hooks/useProducts";
import { useFarmerOrders } from "../hooks/useOrders";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/Badge";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import { formatPrice, formatDate } from "../utils/helpers";
import { useFarmerReviews } from "../hooks/useReviews";
import { StarRating } from "../components/ui/StarRating";
import { Spinner } from "@/components/shared/Loader";

// Dans le composant FarmerDashboard, on va afficher des statistiques clés, un graphique d'évolution des revenus, et les commandes récentes. Les données sont mockées pour le graphique, mais les statistiques et commandes sont dynamiques.

// Mock revenue chart data (à remplacer par de vraies données plus tard)
const revenueData = [
  { month: "Jan", revenus: 45000 },
  { month: "Fév", revenus: 62000 },
  { month: "Mar", revenus: 48000 },
  { month: "Avr", revenus: 80000 },
  { month: "Mai", revenus: 95000 },
  { month: "Jun", revenus: 110000 },
];

const StatCard = ({ icon, label, value, sub, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card padding="lg" className="relative overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-1/3 translate-x-1/3 ${color}`}
      />
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-10`}
      >
        {icon}
      </div>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">{label}</p>
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
        className="text-3xl font-bold text-stone-800 dark:text-stone-100"
      >
        {value}
      </motion.p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </Card>
  </motion.div>
);

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: products, isLoading: loadingProducts } = useMyProducts(); // tableau de produits
  const { data: orders, isLoading: loadingOrders } = useFarmerOrders(); // tableau de commandes
  const { data: farmerReviews, isLoading: loadingReviews } = useFarmerReviews();

  const totalRevenue =
    orders
      ?.filter((o) => o.status === "DELIVERED")
      .reduce((s, o) => s + Number(o.total_price), 0) ?? 0;
  const pendingOrders =
    orders?.filter((o) => o.status === "PENDING").length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const totalProducts = products?.length ?? 0;

  return (
    <>
      <Helmet>
        <title>Tableau de bord – AgriConnect</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
            Bonjour, {user?.first_name} 👋
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {user?.farmer_profile?.farm_name &&
              `${user.farmer_profile.farm_name} · `}
            Voici un résumé de votre activité
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loadingProducts || loadingOrders ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          ) : (
            <>
              <StatCard
                icon={<TrendingUp className="w-5 h-5 text-green-700" />}
                label="Revenus totaux"
                value={formatPrice(totalRevenue)}
                sub="Commandes livrées"
                color="bg-green-500"
                delay={0}
              />
              <StatCard
                icon={<Package className="w-5 h-5 text-blue-700" />}
                label="Mes produits"
                value={String(totalProducts)}
                sub="Produits publiés"
                color="bg-blue-500"
                delay={0.1}
              />
              <StatCard
                icon={<ShoppingBag className="w-5 h-5 text-amber-700" />}
                label="Commandes en attente"
                value={String(pendingOrders)}
                sub="À traiter"
                color="bg-amber-500"
                delay={0.2}
              />
              <StatCard
                icon={<Star className="w-5 h-5 text-purple-700" />}
                label="Total commandes"
                value={String(totalOrders)}
                sub="Toutes commandes"
                color="bg-purple-500"
                delay={0.3}
              />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card padding="lg" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-stone-800 dark:text-stone-100">
                  Évolution des revenus
                </h2>
                <span className="text-xs text-stone-400 bg-stone-50 dark:bg-stone-800 px-3 py-1 rounded-full">
                  6 derniers mois
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={revenueData}
                  margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    strokeOpacity={0.06}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#78716c" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#78716c" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v: number) => [formatPrice(v), "Revenus"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenus"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    fill="url(#colorRev)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card padding="lg" className="h-full">
              <h2 className="font-semibold text-stone-800 dark:text-stone-100 mb-4">
                Actions rapides
              </h2>
              <div className="space-y-3">
                {[
                  {
                    label: "Ajouter un produit",
                    icon: "➕",
                    to: "/my-products",
                  },
                  {
                    label: "Voir les commandes",
                    icon: "📦",
                    to: "/farmer-orders",
                  },
                  { label: "Mon profil", icon: "👤", to: "/profile" },
                ].map((a) => (
                  <button
                    key={a.to}
                    onClick={() => navigate(a.to)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors group"
                  >
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-300 flex-1 text-left">
                      {a.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-stone-800 dark:text-stone-100">
                Commandes récentes
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/farmer-orders")}
              >
                Voir tout →
              </Button>
            </div>
            {!orders?.length ? (
              <p className="text-stone-400 text-sm text-center py-6">
                Aucune commande pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-stone-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-stone-800 dark:text-stone-100 text-sm">
                        Commande #{order.id} ·{" "}
                        <span className="text-stone-500 font-normal">
                          {order.buyer_name}
                        </span>
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <span className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
                        {formatPrice(order.total_price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-stone-800 dark:text-stone-100">
                Avis reçus
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/farmer-reviews")}
              >
                Voir tout →
              </Button>
            </div>
            {loadingReviews ? (
              <div className="flex justify-center py-6">
                <Spinner size={32} />
              </div>
            ) : !farmerReviews?.results.length ? (
              <p className="text-stone-400 text-sm text-center py-6">
                Aucun avis pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {farmerReviews.results.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-stone-100 dark:border-stone-800 last:border-0 pb-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-stone-800 dark:text-stone-100 text-sm">
                          {review.product_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating value={review.rating} size={14} />
                          <span className="text-xs text-stone-400">
                            par {review.buyer_name}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </>
  );
}
