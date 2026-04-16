import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <>
      <Helmet><title>Page introuvable – AgriConnect</title></Helmet>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
            className="text-8xl mb-6"
          >
            🌾
          </motion.div>
          <h1 className="text-7xl font-bold text-stone-200 dark:text-stone-800 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-3">Page introuvable</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-sm">
            Il semblerait que cette page soit partie aux champs… Elle n'existe pas ou a été déplacée.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="secondary">← Retour</Button>
            <Button onClick={() => navigate('/')}>Accueil</Button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
