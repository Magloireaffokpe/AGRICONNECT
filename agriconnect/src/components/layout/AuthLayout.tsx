import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const AuthLayout = () => (
  <div className="min-h-screen flex">
    {/* Left panel — decorative */}
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 via-green-700 to-green-900 relative overflow-hidden flex-col items-center justify-center p-12">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center text-white"
      >
        <div className="text-7xl mb-6">🌾</div>
        <h1 className="text-4xl font-bold mb-4">AgriConnect</h1>
        <p className="text-green-200 text-lg max-w-xs leading-relaxed">
          La marketplace qui connecte les agriculteurs locaux aux acheteurs de confiance.
        </p>
        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            { emoji: '🥦', label: 'Légumes frais' },
            { emoji: '🍎', label: 'Fruits bio' },
            { emoji: '🌾', label: 'Céréales' },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center"
            >
              <div className="text-3xl mb-1">{item.emoji}</div>
              <div className="text-xs text-green-200 font-medium">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Right panel — form */}
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-950">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-lg mb-8 lg:hidden">
          <span className="text-2xl">🌾</span> AgriConnect
        </Link>
        <Outlet />
      </div>
    </div>
  </div>
)
