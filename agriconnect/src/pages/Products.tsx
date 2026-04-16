import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useDebounce } from '../hooks/useDebounce'
import { ProductCard } from '../features/products/ProductCard'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/shared/EmptyState'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { ProductFilters } from '../types'

const CATEGORIES = [
  { value: '', label: 'Toutes catégories' },
  { value: 'FRUITS', label: '🍎 Fruits' },
  { value: 'VEGETABLES', label: '🥦 Légumes' },
  { value: 'CEREALS', label: '🌾 Céréales' },
  { value: 'MEAT', label: '🥩 Viande' },
  { value: 'DAIRY', label: '🥛 Laitiers' },
  { value: 'OTHER', label: '📦 Autre' },
]

const SORT_OPTIONS = [
  { value: '', label: 'Pertinence' },
  { value: '-created_at', label: 'Plus récents' },
  { value: 'price', label: 'Prix croissant' },
  { value: '-price', label: 'Prix décroissant' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [ordering, setOrdering] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  const filters: ProductFilters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category && { category: category as ProductFilters['category'] }),
    ...(ordering && { ordering }),
    page,
    is_available: true,
  }

  const { data, isLoading } = useProducts(filters)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category, ordering])

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setOrdering('')
    setPage(1)
    setSearchParams({})
  }

  const hasFilters = search || category || ordering

  return (
    <>
      <Helmet><title>Catalogue – AgriConnect</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2">
            Catalogue produits
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            {data?.count ?? '...'} produits disponibles auprès de nos agriculteurs
          </p>
        </motion.div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit, un agriculteur…"
              className="input-field pl-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            icon={<SlidersHorizontal className="w-4 h-4" />}
            onClick={() => setShowFilters((v) => !v)}
          >
            Filtres
          </Button>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} icon={<X className="w-4 h-4" />}>
              Effacer
            </Button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800"
          >
            <Select
              label="Catégorie"
              value={category}
              options={CATEGORIES}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Select
              label="Trier par"
              value={ordering}
              options={SORT_OPTIONS}
              onChange={(e) => setOrdering(e.target.value)}
            />
          </motion.div>
        )}

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : !data?.results.length ? (
          <EmptyState
            icon="🔍"
            title="Aucun produit trouvé"
            description="Essayez de modifier vos filtres ou votre recherche."
            action={{ label: 'Effacer les filtres', onClick: clearFilters }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.results.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {(data.next || data.previous) && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="secondary"
                  disabled={!data.previous}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Précédent
                </Button>
                <span className="text-sm text-stone-500">Page {page}</span>
                <Button
                  variant="secondary"
                  disabled={!data.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
