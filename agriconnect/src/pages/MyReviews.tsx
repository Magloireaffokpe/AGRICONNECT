import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Star, Trash2 } from 'lucide-react'
import { useMyReviews, useDeleteReview } from '../hooks/useReviews'
import { Card } from '../components/ui/Card'
import { StarRating } from '../components/ui/StarRating'
import { EmptyState } from '../components/shared/EmptyState'
import { Spinner } from '../components/shared/Loader'
import { formatDate } from '../utils/helpers'
import { useNavigate } from 'react-router-dom'

export default function MyReviews() {
  const { data, isLoading } = useMyReviews() // data est un tableau
  const deleteReview = useDeleteReview()
  const navigate = useNavigate()

  return (
    <>
      <Helmet><title>Mes avis – AgriConnect</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-7 h-7 text-green-700 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Mes avis</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner size={40} /></div>
          ) : !data?.length ? ( // ← .length
            <EmptyState
              icon="⭐"
              title="Aucun avis publié"
              description="Achetez des produits et partagez votre expérience."
              action={{ label: 'Découvrir le catalogue', onClick: () => navigate('/products') }}
            />
          ) : (
            <div className="space-y-4">
              {data.map((review, i) => ( // ← .map direct
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card padding="md">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3
                          className="font-semibold text-stone-800 dark:text-stone-100 hover:text-green-700 dark:hover:text-green-400 cursor-pointer transition-colors"
                          onClick={() => navigate(`/products/${review.product}`)}
                        >
                          {review.product_name}
                        </h3>
                        <p className="text-xs text-stone-400 mt-0.5">{formatDate(review.created_at)}</p>
                      </div>
                      <button
                        onClick={() => deleteReview.mutate(review.id)}
                        disabled={deleteReview.isPending}
                        className="p-2 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <StarRating value={review.rating} size={16} />
                    {review.comment && (
                      <p className="text-sm text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}