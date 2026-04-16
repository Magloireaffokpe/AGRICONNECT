import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export const EmptyState = ({ icon = '📭', title, description, action }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center"
  >
    <motion.div
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 3 }}
      className="text-5xl mb-4"
    >
      {icon}
    </motion.div>
    <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">{title}</h3>
    {description && <p className="text-sm text-stone-400 max-w-xs mb-6">{description}</p>}
    {action && <Button onClick={action.onClick}>{action.label}</Button>}
  </motion.div>
)
