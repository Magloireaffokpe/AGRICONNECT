import { api } from '../lib/axios'
import { LoginResponse, User } from '../types'

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/api/auth/login/', { email, password })
    return data
  },

  register: async (payload: Record<string, string>): Promise<{ message: string; user: User }> => {
    const { data } = await api.post('/api/auth/register/', payload)
    return data
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/api/auth/me/')
    return data
  },

  changePassword: async (payload: {
    old_password: string
    new_password: string
    new_password_confirm: string
  }): Promise<{ message: string }> => {
    const { data } = await api.post('/api/auth/change-password/', payload)
    return data
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post('/api/auth/password-reset/', { email })
    return data
  },

  confirmPasswordReset: async (payload: {
    token: string
    new_password: string
    new_password_confirm: string
  }): Promise<{ message: string }> => {
    const { data } = await api.post('/api/auth/password-reset-confirm/', payload)
    return data
  },
}
