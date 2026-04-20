export const formatPrice = (price: string | number, currency = 'FCFA') =>
  `${Number(price).toLocaleString('fr-FR')} ${currency}`

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

export const categoryLabel: Record<string, string> = {
  FRUITS: '🍎 Fruits',
  VEGETABLES: '🥦 Légumes',
  CEREALS: '🌾 Céréales',
  MEAT: '🥩 Viande',
  DAIRY: '🥛 Produits laitiers',
  OTHER: '📦 Autre',
}

export const statusLabel: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
}

export const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  IN_TRANSIT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export const imageUrl = (path: string | null) => {
  if (!path) return '/placeholder-product.jpg'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}${path}`
}

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const checkPasswordStrength = (password: string) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  digit: /[0-9]/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
})
