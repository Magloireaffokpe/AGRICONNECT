import { cn } from '../../utils/cn'

interface BadgeProps {
  label: string
  className?: string
  dot?: boolean
}

export const Badge = ({ label, className, dot }: BadgeProps) => (
  <span className={cn('badge', className)}>
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />}
    {label}
  </span>
)

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    PENDING:   { label: 'En attente',  className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    CONFIRMED: { label: 'Confirmée',   className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    DELIVERED: { label: 'Livrée',      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    CANCELLED: { label: 'Annulée',     className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    IN_TRANSIT:{ label: 'En transit',  className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  }
  const conf = map[status] || { label: status, className: 'bg-stone-100 text-stone-600' }
  return <Badge label={conf.label} className={conf.className} dot />
}
