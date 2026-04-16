import { api } from '../lib/axios'
import { PaginatedResponse, Review } from '../types'

export const reviewsService = {
  list: async (params?: Record<string, string | number>): Promise<PaginatedResponse<Review>> => {
    const { data } = await api.get('/api/reviews/', { params })
    return data
  },

  create: async (payload: {
    product: number
    rating: number
    comment: string
  }): Promise<Review> => {
    const { data } = await api.post('/api/reviews/', payload)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/reviews/${id}/`)
  },

  // ✅ Correction : retourne un tableau de Review
  myReviews: async (): Promise<Review[]> => {
    const { data } = await api.get('/api/reviews/my_reviews/')
    return data
  },
}