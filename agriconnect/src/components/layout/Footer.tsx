import { Link } from 'react-router-dom'

export const Footer = () => (
  <footer className="border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-950 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-lg">
          <span className="text-2xl">🌾</span> AgriConnect
        </div>
        <p className="text-sm text-stone-400">
          © {new Date().getFullYear()} AgriConnect. Tous droits réservés.
        </p>
        <div className="flex gap-4 text-sm text-stone-400">
          <Link to="/products" className="hover:text-green-600 transition-colors">Catalogue</Link>
          <Link to="/register" className="hover:text-green-600 transition-colors">S'inscrire</Link>
        </div>
      </div>
    </div>
  </footer>
)
