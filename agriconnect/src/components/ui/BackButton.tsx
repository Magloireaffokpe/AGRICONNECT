import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface Props { label?: string; to?: string }

export const BackButton = ({ label = 'Retour', to }: Props) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-green-700 dark:hover:text-green-400 transition-colors mb-6 group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {label}
    </button>
  )
}
