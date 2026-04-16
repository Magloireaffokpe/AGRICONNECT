import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface StarRatingProps {
  value: number
  max?: number
  interactive?: boolean
  onChange?: (v: number) => void
  size?: number
}

export const StarRating = ({ value, max = 5, interactive, onChange, size = 16 }: StarRatingProps) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
      <motion.button
        key={star}
        type={interactive ? 'button' : undefined}
        onClick={() => interactive && onChange?.(star)}
        whileHover={interactive ? { scale: 1.2 } : undefined}
        whileTap={interactive ? { scale: 0.9 } : undefined}
        className={interactive ? 'cursor-pointer' : 'cursor-default'}
        style={{ lineHeight: 0 }}
      >
        <Star
          size={size}
          className={
            star <= Math.round(value)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-stone-200 text-stone-200 dark:fill-stone-700 dark:text-stone-700'
          }
        />
      </motion.button>
    ))}
  </div>
)
