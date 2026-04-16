import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsService } from '../services/reviews'
import { toast } from 'sonner'

export const useReviews = (params?: Record<string, string | number>) =>
  useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewsService.list(params),
  })

export const useMyReviews = () =>
  useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => reviewsService.myReviews(),
  })

export const useCreateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: reviewsService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
      qc.invalidateQueries({ queryKey: ['my-reviews'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Avis publié !')
    },
    onError: () => toast.error('Erreur lors de la publication de l\'avis'),
  })
}

export const useDeleteReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reviewsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
      qc.invalidateQueries({ queryKey: ['my-reviews'] })
      toast.success('Avis supprimé')
    },
  })
}
