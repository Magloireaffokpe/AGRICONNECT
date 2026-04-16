import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { useMyOrders } from '../hooks/useOrders'
import { StatusBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/shared/EmptyState'
import { Spinner } from '../components/shared/Loader'
import { formatPrice, formatDate } from '../utils/helpers'

export default function MyOrders() {
  const { data, isLoading } = useMyOrders() // data est un tableau d'orders
  const navigate = useNavigate()

  return (
    <>
      <Helmet><title>Mes commandes – AgriConnect</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList className="w-7 h-7 text-green-700 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Mes commandes</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner size={40} /></div>
          ) : !data?.length ? ( // ← ici .length
            <EmptyState
              icon="📦"
              title="Aucune commande"
              description="Vous n'avez pas encore passé de commande."
              action={{ label: 'Découvrir le catalogue', onClick: () => navigate('/products') }}
            />
          ) : (
            <div className="space-y-4">
              {data.map((order, i) => ( // ← .map direct
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    hover
                    className="cursor-pointer"
                    onClick={() => navigate(`/my-orders/${order.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-stone-800 dark:text-stone-100">
                            Commande #{order.id}
                          </h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">
                          {formatDate(order.created_at)} · {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-stone-600 dark:text-stone-400 truncate">
                          {order.items.map((i) => i.product_name).join(', ')}
                        </p>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <p className="text-xl font-bold text-green-700 dark:text-green-400 mb-1">
                          {formatPrice(order.total_price)}
                        </p>
                        <ChevronRight className="w-5 h-5 text-stone-300 dark:text-stone-600 ml-auto" />
                      </div>
                    </div>
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