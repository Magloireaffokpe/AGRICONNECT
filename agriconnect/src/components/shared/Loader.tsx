import { motion } from 'framer-motion'

export const Spinner = ({ size = 24 }: { size?: number }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    style={{ width: size, height: size }}
    className="rounded-full border-2 border-stone-200 border-t-green-600"
  />
)

export const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 gap-4">
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-4xl"
    >
      🌾
    </motion.div>
    <p className="text-stone-500 text-sm font-medium">Chargement…</p>
  </div>
)
