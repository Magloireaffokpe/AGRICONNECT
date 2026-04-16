import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StarRating } from '../../components/ui/StarRating'
import { useCreateReview } from '../../hooks/useReviews'

interface Props { productId: number }

export const ReviewForm = ({ productId }: Props) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const createReview = useCreateReview()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) return
    createReview.mutate({ product: productId, rating, comment }, {
      onSuccess: () => { setRating(0); setComment('') },
    })
  }

  return (
    <Card padding="md">
      <h3 className="font-semibold text-stone-800 dark:text-stone-100 mb-4">Laisser un avis</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">Note :</p>
          <StarRating value={rating} interactive onChange={setRating} size={28} />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec ce produit…"
          rows={3}
          className="input-field resize-none"
        />
        <Button type="submit" loading={createReview.isPending} disabled={!rating}>
          Publier mon avis
        </Button>
      </form>
    </Card>
  )
}
