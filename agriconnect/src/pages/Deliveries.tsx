import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Truck,
  MapPin,
  Calendar,
  FileText,
  Package,
  CheckCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryService } from "../services/delivery";
import { Card } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { EmptyState } from "../components/shared/EmptyState";
import { Spinner } from "../components/shared/Loader";
import { formatDate } from "../utils/helpers";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import type { Delivery } from "../types"; // ✅ import unique du type

export default function Deliveries() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState("");

  // ✅ utilisation correcte du typage, pas de conflit
  const { data, isLoading } = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => deliveryService.list(),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await deliveryService.updateStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveries"] });
      toast.success("Statut de livraison mis à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const canModify = (delivery: Delivery) => {
    if (!user) return false;
    if (user.role === "ADMIN") return false;
    if (user.role === "FARMER" && delivery.delivery_status === "PENDING")
      return true;
    return false;
  };

  // ✅ gestion robuste : data peut être paginé (results) ou tableau direct
  const deliveriesList =
    (data as any)?.results ?? (Array.isArray(data) ? data : []);
  const filtered = deliveriesList.filter((d: Delivery) =>
    filter ? d.delivery_status === filter : true,
  );

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size={40} />
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Livraisons – AgriConnect</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-green-700 dark:text-green-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">
                {user?.role === "FARMER"
                  ? "Livraisons de mes commandes"
                  : "Toutes les livraisons"}
              </h1>
            </div>
            <Select
              options={[
                { value: "", label: "Tous statuts" },
                { value: "PENDING", label: "En attente" },
                { value: "IN_TRANSIT", label: "En transit" },
                { value: "DELIVERED", label: "Livrée" },
                { value: "FAILED", label: "Échouée" },
              ]}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-44"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="🚚"
              title="Aucune livraison"
              description="Aucune livraison trouvée."
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((delivery: Delivery) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card padding="sm" className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
                      <h3 className="font-semibold text-stone-800 dark:text-stone-100 text-base sm:text-lg">
                        Commande #{delivery.order}
                      </h3>
                      <StatusBadge status={delivery.delivery_status} />
                    </div>

                    <div className="space-y-2 text-sm sm:text-base">
                      {delivery.delivery_address && (
                        <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                          <MapPin className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                          <span className="break-all">
                            {delivery.delivery_address}
                          </span>
                        </div>
                      )}
                      {delivery.delivery_date && (
                        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 flex-wrap">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>
                            Livraison prévue le{" "}
                            <strong>
                              {formatDate(delivery.delivery_date)}
                            </strong>
                          </span>
                        </div>
                      )}
                      {delivery.notes && (
                        <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                          <FileText className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                          <span>{delivery.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-stone-400 mb-1.5">
                        <span>En attente</span>
                        <span>En transit</span>
                        <span>Livré</span>
                      </div>
                      <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width:
                              delivery.delivery_status === "DELIVERED"
                                ? "100%"
                                : delivery.delivery_status === "IN_TRANSIT"
                                  ? "60%"
                                  : "10%",
                          }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full bg-green-500 rounded-full"
                        />
                      </div>
                    </div>

                    {canModify(delivery) && (
                      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            updateStatus.mutate({
                              id: delivery.id,
                              status: "IN_TRANSIT",
                            })
                          }
                          loading={updateStatus.isPending}
                          className="w-full"
                        >
                          <Package className="w-4 h-4 mr-1" />
                          Marquer comme expédié
                        </Button>
                      </div>
                    )}

                    {delivery.delivery_status === "DELIVERED" && (
                      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Livraison confirmée par l'acheteur
                      </div>
                    )}
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
