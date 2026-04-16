import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Plus, Pencil, Trash2, Package, Upload, X } from 'lucide-react'
import { useMyProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useUpdateStock } from '../hooks/useProducts'
import { Product, ProductCategory } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/shared/EmptyState'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import { formatPrice, imageUrl, categoryLabel } from '../utils/helpers'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().min(10, 'Description trop courte'),
  category: z.string().min(1, 'Catégorie requise'),
  price: z.coerce.number().positive('Prix invalide'),
  quantity_available: z.coerce.number().int().min(0, 'Quantité invalide'),
})
type FormData = z.infer<typeof schema>

const CATEGORIES = [
  { value: 'FRUITS', label: '🍎 Fruits' },
  { value: 'VEGETABLES', label: '🥦 Légumes' },
  { value: 'CEREALS', label: '🌾 Céréales' },
  { value: 'MEAT', label: '🥩 Viande' },
  { value: 'DAIRY', label: '🥛 Laitiers' },
  { value: 'OTHER', label: '📦 Autre' },
]

export default function MyProducts() {
  const { data: products, isLoading } = useMyProducts() // products est un tableau
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const updateStock = useUpdateStock()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const selectedFile = useRef<File | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', description: '', category: 'VEGETABLES', price: 0, quantity_available: 1 })
    setPreview(null)
    selectedFile.current = null
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    reset({
      name: product.name,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      quantity_available: product.quantity_available,
    })
    setPreview(imageUrl(product.image))
    selectedFile.current = null
    setModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop grande (max 5 Mo)'); return }
    selectedFile.current = file
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: FormData) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)))
    if (selectedFile.current) fd.append('image', selectedFile.current)

    if (editing) {
      await updateProduct.mutateAsync({ id: editing.id, fd })
    } else {
      await createProduct.mutateAsync(fd)
    }
    setModalOpen(false)
    setPreview(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteProduct.mutateAsync(deleteId)
    setDeleteId(null)
  }

  return (
    <>
      <Helmet><title>Mes produits – AgriConnect</title></Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-7 h-7 text-green-700 dark:text-green-400" />
              <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Mes produits</h1>
              {products && (
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
                  {products.length}
                </span>
              )}
            </div>
            <Button onClick={openCreate} icon={<Plus className="w-4 h-4" />}>
              Nouveau produit
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : !products?.length ? (
            <EmptyState
              icon="🌱"
              title="Aucun produit publié"
              description="Ajoutez votre premier produit pour commencer à vendre."
              action={{ label: 'Ajouter un produit', onClick: openCreate }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card padding="sm" className="overflow-hidden group">
                      <div className="relative h-44 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden mb-4">
                        <img
                          src={imageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-full text-stone-600 dark:text-stone-300">
                            {categoryLabel[product.category] || product.category}
                          </span>
                        </div>
                        {!product.is_available && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                            <span className="text-white text-xs font-semibold bg-red-500 px-3 py-1 rounded-full">Épuisé</span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-stone-800 dark:text-stone-100 mb-1 truncate">{product.name}</h3>
                      <p className="text-green-700 dark:text-green-400 font-bold mb-1">{formatPrice(product.price)}</p>
                      <p className={`text-xs mb-4 ${product.quantity_available < 10 ? 'text-amber-600' : 'text-stone-400'}`}>
                        Stock : {product.quantity_available} unités
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          icon={<Pencil className="w-3.5 h-3.5" />}
                          onClick={() => openEdit(product)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() => setDeleteId(product.id)}
                        />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Modal create/edit */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? 'Modifier le produit' : 'Nouveau produit'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Image du produit</p>
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden ${
                  preview
                    ? 'border-green-400'
                    : 'border-stone-200 dark:border-stone-700 hover:border-green-400'
                }`}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Changer l'image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-400">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Cliquez pour uploader (max 5 Mo)</span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Nom du produit" placeholder="Tomates bio" error={errors.name?.message} {...register('name')} />
              <Select
                label="Catégorie"
                options={CATEGORIES}
                error={errors.category?.message}
                {...register('category')}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="Décrivez votre produit…"
                className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">⚠ {errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prix (FCFA)" type="number" placeholder="500" error={errors.price?.message} {...register('price')} />
              <Input label="Quantité disponible" type="number" placeholder="100" error={errors.quantity_available?.message} {...register('quantity_available')} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" loading={isSubmitting} className="flex-1">
                {editing ? 'Enregistrer' : 'Publier'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal delete */}
        <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Supprimer le produit" size="sm">
          <p className="text-stone-600 dark:text-stone-400 text-sm mb-6">
            Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">Annuler</Button>
            <Button variant="danger" loading={deleteProduct.isPending} onClick={handleDelete} className="flex-1">
              Supprimer
            </Button>
          </div>
        </Modal>
      </div>
    </>
  )
}