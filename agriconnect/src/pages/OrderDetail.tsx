import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { MapPin, Truck } from 'lucide-react'
import { BackButton } from '../components/ui/BackButton'
import { useOrder } from '../hooks/useOrders'
import { StatusBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/shared/Loader'
import { formatPrice, formatDate } from '../utils/helpers'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading } = useOrder(Number(id))

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={40} /></div>
  if (!order) return null

  return (
    <>
      

// Dans le composant OrderDetail :
<Helmet>
  <title>{order ? `Commande #${order.id} – AgriConnect` : 'Détails commande – AgriConnect'}</title>
</Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BackButton />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Commande #{order.id}</h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">{formatDate(order.created_at)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Items */}
          <Card padding="md">
            <h2 className="font-semibold text-stone-800 dark:text-stone-100 mb-4">Articles commandés</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800 last:border-0">
                  <div>
                    <p className="font-medium text-stone-800 dark:text-stone-100">{item.product_name}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold text-stone-800 dark:text-stone-100">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <span className="font-bold text-stone-800 dark:text-stone-100">Total</span>
              <span className="text-xl font-bold text-green-700 dark:text-green-400">{formatPrice(order.total_price)}</span>
            </div>
          </Card>

          {/* Delivery info */}
          {order.delivery && (
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-stone-800 dark:text-stone-100">Livraison</h2>
                <StatusBadge status={order.delivery.delivery_status} />
              </div>
              {order.delivery.delivery_address && (
                <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{order.delivery.delivery_address}</span>
                </div>
              )}
              {order.delivery.delivery_date && (
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
                  Date de livraison : <strong>{formatDate(order.delivery.delivery_date)}</strong>
                </p>
              )}
              {order.delivery.notes && (
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Notes : {order.delivery.notes}
                </p>
              )}
            </Card>
          )}
        </motion.div>
      </div>
    </>
  )
}
