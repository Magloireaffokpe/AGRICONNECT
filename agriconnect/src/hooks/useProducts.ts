import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsService } from '../services/products'
import { ProductFilters } from '../types'
import { toast } from 'sonner'

export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.list(filters),
  })

export const useProduct = (id: number) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  })

export const useMyProducts = () =>
  useQuery({
    queryKey: ['my-products'],
    queryFn: () => productsService.myProducts(),
  })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fd: FormData) => productsService.create(fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produit créé avec succès !')
    },
    onError: () => toast.error('Erreur lors de la création du produit'),
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, fd }: { id: number; fd: FormData }) => productsService.update(id, fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produit mis à jour !')
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produit supprimé')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })
}

export const useUpdateStock = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      productsService.updateStock(id, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-products'] })
      toast.success('Stock mis à jour !')
    },
  })
}

