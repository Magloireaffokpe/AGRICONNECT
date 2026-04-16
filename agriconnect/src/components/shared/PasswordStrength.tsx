import { motion } from 'framer-motion'
import { checkPasswordStrength } from '../../utils/helpers'
import { Check, X } from 'lucide-react'

interface Props { password: string }

export const PasswordStrength = ({ password }: Props) => {
  const checks = checkPasswordStrength(password)
  const score = Object.values(checks).filter(Boolean).length
  const scoreColors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-green-400', 'bg-green-600']
  const scoreLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']

  if (!password) return null

  return (
    <div className="space-y-3">
      {/* Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: score >= i ? '100%' : '0%' }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`h-full rounded-full ${scoreColors[score - 1] || 'bg-transparent'}`}
            />
          </div>
        ))}
      </div>
      <p className={`text-xs font-medium ${scoreColors[score - 1]?.replace('bg-', 'text-')}`}>
        {scoreLabels[score - 1] || ''}
      </p>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { key: 'length',    label: '8 caractères minimum' },
          { key: 'uppercase', label: 'Une majuscule' },
          { key: 'digit',     label: 'Un chiffre' },
          { key: 'special',   label: 'Un caractère spécial' },
        ].map(({ key, label }) => {
          const ok = checks[key as keyof typeof checks]
          return (
            <div key={key} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600 dark:text-green-400' : 'text-stone-400'}`}>
              {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
