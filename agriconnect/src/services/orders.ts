import { api } from '../lib/axios'
import { Order, OrderStatus, PaginatedResponse } from '../types'

export const ordersService = {
  list: async (params?: Record<string, string>): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get('/api/orders/', { params })
    return data
  },

  create: async (payload: {
    delivery_type: string
    items: { product: number; quantity: number }[]
  }): Promise<Order> => {
    const { data } = await api.post('/api/orders/', payload)
    return data
  },

  getById: async (id: number): Promise<Order> => {
    const { data } = await api.get(`/api/orders/${id}/`)
    return data
  },

  updateStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch(`/api/orders/${id}/update_status/`, { status })
    return data
  },

  // ✅ Correction : retourne un tableau d'Order (non paginé)
  myOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/api/orders/my_orders/')
    return data // data est directement le tableau
  },

  // ✅ Correction : retourne un tableau d'Order
  farmerOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/api/orders/farmer_orders/')
    return data
  },
}