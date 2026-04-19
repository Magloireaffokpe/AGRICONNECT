import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ClipboardList,
  ChevronRight,
  CheckCircle,
  Package,
} from "lucide-react";
import { useMyOrders, useConfirmDelivery } from "../hooks/useOrders";
import { StatusBadge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/shared/EmptyState";
import { Spinner } from "../components/shared/Loader";
import { formatPrice, formatDate } from "../utils/helpers";

export default function MyOrders() {
  const { data, isLoading } = useMyOrders();
  const confirmDelivery = useConfirmDelivery();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Mes commandes – AgriConnect</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList className="w-7 h-7 text-green-700 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
              Mes commandes
            </h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size={40} />
            </div>
          ) : !data?.length ? (
            <EmptyState
              icon="📦"
              title="Aucune commande"
              description="Vous n'avez pas encore passé de commande."
              action={{
                label: "Découvrir le catalogue",
                onClick: () => navigate("/products"),
              }}
            />
          ) : (
            <div className="space-y-4">
              {data.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-stone-800 dark:text-stone-100">
                            Commande #{order.id}
                          </h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">
                          {formatDate(order.created_at)} · {order.items.length}{" "}
                          article{order.items.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-stone-600 dark:text-stone-400 truncate">
                          {order.items.map((i) => i.product_name).join(", ")}
                        </p>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <p className="text-xl font-bold text-green-700 dark:text-green-400 mb-1">
                          {formatPrice(order.total_price)}
                        </p>

                        {order.status === "CONFIRMED" && (
                          <Button
                            variant="primary" // ou "default", selon ce qui existe
                            size="sm"
                            onClick={() => confirmDelivery.mutate(order.id)}
                            loading={confirmDelivery.isPending}
                            className="mt-2 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white" // style vert personnalisé
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Confirmer la réception
                          </Button>
                        )}
                        {order.status === "DELIVERED" && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full mt-2">
                            <CheckCircle className="w-3 h-3" />
                            Livraison confirmée
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-stone-300 dark:text-stone-600 ml-auto mt-2" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
