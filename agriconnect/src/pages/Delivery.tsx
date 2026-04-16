import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Truck, MapPin, Calendar, FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { deliveryService } from '../services/delivery'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/shared/EmptyState'
import { Spinner } from '../components/shared/Loader'
import { formatDate } from '../utils/helpers'

export default function Delivery() {
  const { data, isLoading } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => deliveryService.list(),
  })

  return (
    <>
      <Helmet><title>Mes livraisons – AgriConnect</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Truck className="w-7 h-7 text-green-700 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Mes livraisons</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner size={40} /></div>
          ) : !data?.results.length ? (
            <EmptyState
              icon="🚚"
              title="Aucune livraison"
              description="Vos livraisons apparaîtront ici après validation de vos commandes."
            />
          ) : (
            <div className="space-y-4">
              {data.results.map((delivery, i) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card padding="md">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-stone-800 dark:text-stone-100">
                        Livraison #{delivery.id}
                      </h3>
                      <StatusBadge status={delivery.delivery_status} />
                    </div>

                    <div className="space-y-2">
                      {delivery.delivery_address && (
                        <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                          <MapPin className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                          <span>{delivery.delivery_address}</span>
                        </div>
                      )}
                      {delivery.delivery_date && (
                        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>Livraison prévue le <strong>{formatDate(delivery.delivery_date)}</strong></span>
                        </div>
                      )}
                      {delivery.notes && (
                        <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                          <FileText className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                          <span>{delivery.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-stone-400 mb-1.5">
                        <span>En attente</span>
                        <span>En transit</span>
                        <span>Livré</span>
                      </div>
                      <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width:
                              delivery.delivery_status === 'DELIVERED' ? '100%' :
                              delivery.delivery_status === 'IN_TRANSIT' ? '60%' : '10%'
                          }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full bg-green-500 rounded-full"
                        />
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
