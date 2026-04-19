import { api } from "../lib/axios";
import { Delivery, PaginatedResponse } from "../types";

export const deliveryService = {
  list: async (): Promise<PaginatedResponse<Delivery>> => {
    const { data } = await api.get("/api/delivery/");
    return data;
  },

  getById: async (id: number): Promise<Delivery> => {
    const { data } = await api.get(`/api/delivery/${id}/`);
    return data;
  },

  update: async (id: number, payload: Partial<Delivery>): Promise<Delivery> => {
    const { data } = await api.put(`/api/delivery/${id}/`, payload);
    return data;
  },

  // ✅ Mise à jour partielle du statut (PATCH)
  updateStatus: async (id: number, status: string): Promise<Delivery> => {
    const { data } = await api.patch(`/api/delivery/${id}/`, {
      delivery_status: status,
    });
    return data;
  },
};
