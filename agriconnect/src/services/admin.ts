import { api } from '../lib/axios'
import { AdminStats, PaginatedResponse, User } from '../types'

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get('/api/admin/stats/')
    return data
  },

  listUsers: async (params?: Record<string, string>): Promise<PaginatedResponse<User>> => {
    const { data } = await api.get('/api/users/', { params })
    return data
  },

  toggleUserActive: async (id: number): Promise<{ is_active: boolean; message: string }> => {
    const { data } = await api.post(`/api/users/${id}/activate/`)
    return data
  },

  verifyFarmer: async (id: number): Promise<{ verified: boolean }> => {
    const { data } = await api.patch(`/api/users/farmers/${id}/verify/`, { verified: true })
    return data
  },
}
