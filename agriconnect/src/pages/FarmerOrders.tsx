import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ClipboardList, ChevronDown } from 'lucide-react'
import { useFarmerOrders, useUpdateOrderStatus } from '../hooks/useOrders'
import { Order, OrderStatus } from '../types'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/shared/EmptyState'
import { Spinner } from '../components/shared/Loader'
import { formatPrice, formatDate } from '../utils/helpers'

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'DELIVERED',
  DELIVERED: null,
  CANCELLED: null,
}

const NEXT_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Confirmer la commande',
  CONFIRMED: 'Marquer comme livrée',
  DELIVERED: '',
  CANCELLED: '',
}

export default function FarmerOrders() {
  const { data: orders, isLoading } = useFarmerOrders() // orders est un tableau
  const updateStatus = useUpdateOrderStatus()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleUpdateStatus = async (order: Order, status: OrderStatus) => {
    await updateStatus.mutateAsync({ id: order.id, status })
    setSelectedId(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20"><Spinner size={40} /></div>
    )
  }

  if (!orders?.length) {
    return (
      <>
        <Helmet><title>Commandes reçues – AgriConnect</title></Helmet>
        <EmptyState
          icon="📭"
          title="Aucune commande reçue"
          description="Les commandes liées à vos produits apparaîtront ici."
        />
      </>
    )
  }

  return (
    <>
      <Helmet><title>Commandes reçues – AgriConnect</title></Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList className="w-7 h-7 text-green-700 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Commandes reçues</h1>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
              {orders.length}
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((order, i) => {
              const nextStatus = NEXT_STATUS[order.status]
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card padding="md">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-stone-800 dark:text-stone-100">
                            Commande #{order.id}
                          </h3>
                          <StatusBadge status={order.status} />
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            order.delivery_type === 'HOME_DELIVERY'
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          }`}>
                            {order.delivery_type === 'HOME_DELIVERY' ? '🚚 Livraison' : '🏪 Retrait'}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">
                          <span className="font-medium text-stone-700 dark:text-stone-300">{order.buyer_name}</span>
                          {' · '}{formatDate(order.created_at)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {order.items.map((item) => (
                            <span key={item.id} className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-full">
                              {item.product_name} ×{item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-700 dark:text-green-400">
                            {formatPrice(order.total_price)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {nextStatus && (
                            <Button
                              size="sm"
                              loading={updateStatus.isPending}
                              onClick={() => handleUpdateStatus(order, nextStatus)}
                            >
                              {NEXT_LABEL[order.status]}
                            </Button>
                          )}
                          {order.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleUpdateStatus(order, 'CANCELLED')}
                            >
                              Annuler
                            </Button>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedId(selectedId === order.id ? null : order.id)}
                          className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition-colors"
                        >
                          <motion.div animate={{ rotate: selectedId === order.id ? 180 : 0 }}>
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </button>
                      </div>
                    </div>

                    {selectedId === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800"
                      >
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-stone-600 dark:text-stone-400">
                                {item.product_name} × {item.quantity}
                              </span>
                              <span className="font-medium text-stone-800 dark:text-stone-100">
                                {formatPrice(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {order.delivery?.delivery_address && (
                          <p className="text-sm text-stone-500 dark:text-stone-400 mt-3">
                            📍 {order.delivery.delivery_address}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </>
  )
}