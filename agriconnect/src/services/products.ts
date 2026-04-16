import { api } from '../lib/axios'
import { PaginatedResponse, Product, ProductFilters } from '../types'

export const productsService = {
  list: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    )
    const { data } = await api.get('/api/products/', { params })
    return data
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/api/products/${id}/`)
    return data
  },

  create: async (formData: FormData): Promise<Product> => {
    const { data } = await api.post('/api/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  update: async (id: number, formData: FormData): Promise<Product> => {
    const { data } = await api.patch(`/api/products/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/products/${id}/`)
  },

   myProducts: async (): Promise<Product[]> => {
    const { data } = await api.get('/api/products/my_products/')
    // Si le backend retourne { results: [...] }, on extrait
    return Array.isArray(data) ? data : data.results || []
  },


  updateStock: async (id: number, quantity_available: number): Promise<Product> => {
    const { data } = await api.patch(`/api/products/${id}/update_stock/`, { quantity_available })
    return data
  },
}
