import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../services/orders";
import { Order, OrderStatus } from "../types";
import { toast } from "sonner";

export const useOrders = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersService.list(params),
  });

export const useMyOrders = () =>
  useQuery({
    queryKey: ["my-orders"],
    queryFn: () => ordersService.myOrders(),
  });

export const useFarmerOrders = () =>
  useQuery<Order[]>({
    queryKey: ["farmer-orders"],
    queryFn: () => ordersService.farmerOrders(),
  });

export const useOrder = (id: number) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ordersService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Commande passée avec succès !");
    },
    onError: () => toast.error("Erreur lors de la commande"),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => {
      // Force l'invalidation et le re-fetch des commandes farmer
      qc.invalidateQueries({ queryKey: ["farmer-orders"] });
      qc.refetchQueries({ queryKey: ["farmer-orders"] });
      // Optionnel : invalider aussi les autres listes
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Statut mis à jour !");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
};

export const useConfirmDelivery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersService.confirmDelivery(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["farmer-orders"] });
      toast.success("Merci ! Votre confirmation a été enregistrée.");
    },
    onError: () => toast.error("Erreur lors de la confirmation."),
  });
};
