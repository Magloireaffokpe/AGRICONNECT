import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Mail, Lock, User, Phone, MapPin, Sprout, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { PasswordStrength } from '../components/shared/PasswordStrength'
import { authService } from '../services/auth'

// Schéma de validation avec messages clairs
const schema = z.object({
  first_name: z.string().min(2, 'Prénom requis (2 caractères minimum)'),
  last_name: z.string().min(2, 'Nom requis (2 caractères minimum)'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide (8 chiffres minimum)'),
  location: z.string().min(2, 'Ville / localisation requise'),
  role: z.enum(['FARMER', 'BUYER']),
  farm_name: z.string().optional(),
  password: z.string()
    .min(8, '8 caractères minimum')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Doit contenir au moins un caractère spécial (!@#$%^&*)'),
  password_confirm: z.string(),
}).refine((d) => d.password === d.password_confirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirm'],
})

type FormData = z.infer<typeof schema>

const STEPS = ['Rôle', 'Infos', 'Sécurité']

export default function Register() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState(0)
  const [watchedPassword, setWatchedPassword] = useState('')

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: (params.get('role') as 'FARMER' | 'BUYER') || 'BUYER' },
    mode: 'onChange', // Valide en temps réel
  })

  const role = watch('role')
  const password = watch('password') || ''

  useEffect(() => { setWatchedPassword(password) }, [password])

  const nextStep = async () => {
    const fieldsToValidate: (keyof FormData)[][] = [
      ['role'],
      ['first_name', 'last_name', 'email', 'phone', 'location'],
      ['password', 'password_confirm'],
    ]
    const currentFields = fieldsToValidate[step]
    const isValidStep = await trigger(currentFields)

    if (!isValidStep) {
      // Affiche une notification pour chaque erreur présente
      const fieldErrors = Object.keys(errors)
        .filter(key => currentFields.includes(key as keyof FormData))
        .map(key => errors[key as keyof FormData]?.message)
        .filter(Boolean)
        .join(', ')
      toast.error(fieldErrors || 'Veuillez corriger les erreurs avant de continuer')
      return
    }
    setStep(s => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    try {
      // Nettoyer les champs optionnels vides
      const payload = { ...data }
      if (payload.role !== 'FARMER') delete payload.farm_name
      await authService.register(payload as Record<string, string>)
      toast.success('Compte créé avec succès ! Redirection vers la connexion...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: unknown) {
      const resp = (err as { response?: { data?: Record<string, string[]> } })?.response?.data
      const msg = resp ? Object.values(resp).flat()[0] : 'Erreur lors de l\'inscription'
      toast.error(msg)
    }
  }

  const completion = Math.round(((step) / STEPS.length) * 100)

  return (
    <>
      <Helmet><title>Inscription – AgriConnect</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-1">Créer un compte 🌱</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-6">Rejoignez la communauté AgriConnect</p>

        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step ? 'bg-green-600 text-white' : i === step ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 ring-2 ring-green-600' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                }`}>{i < step ? '✓' : i + 1}</div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 w-8 bg-stone-200 dark:bg-stone-700">
                    <div className={`h-full bg-green-600 transition-all duration-500 ${i < step ? 'w-full' : 'w-0'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>{STEPS[step]}</span>
              <span>{completion}%</span>
            </div>
            <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.4 }}
                className="h-full bg-green-600 rounded-full"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Étape 0 : Rôle */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-4">Vous êtes :</p>
                {(['BUYER', 'FARMER'] as const).map((r) => (
                  <motion.button
                    key={r}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setValue('role', r)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                      role === r ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{r === 'BUYER' ? '🛒' : '👨‍🌾'}</span>
                      <div>
                        <div className="font-semibold text-stone-800 dark:text-stone-100">{r === 'BUYER' ? 'Acheteur' : 'Agriculteur'}</div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          {r === 'BUYER' ? 'Je cherche des produits frais locaux' : 'Je vends mes récoltes directement'}
                        </div>
                      </div>
                      {role === r && <div className="ml-auto w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">✓</div>}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Étape 1 : Informations personnelles */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Prénom" placeholder="Jean" icon={<User className="w-4 h-4" />} error={errors.first_name?.message} {...register('first_name')} />
                  <Input label="Nom" placeholder="Dupont" error={errors.last_name?.message} {...register('last_name')} />
                </div>
                <Input label="Email" type="email" placeholder="jean@example.com" icon={<Mail className="w-4 h-4" />} error={errors.email?.message} {...register('email')} />
                <Input label="Téléphone" placeholder="66000000" icon={<Phone className="w-4 h-4" />} error={errors.phone?.message} {...register('phone')} />
                <Input label="Ville / Localisation" placeholder="Cotonou" icon={<MapPin className="w-4 h-4" />} error={errors.location?.message} {...register('location')} />
                {role === 'FARMER' && (
                  <Input label="Nom de la ferme" placeholder="Ma Ferme Bio" icon={<Sprout className="w-4 h-4" />} error={errors.farm_name?.message} {...register('farm_name')} />
                )}
              </motion.div>
            )}

            {/* Étape 2 : Sécurité (mot de passe) */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <Input label="Mot de passe" type="password" placeholder="••••••••" icon={<Lock className="w-4 h-4" />} error={errors.password?.message} {...register('password')} />
                <PasswordStrength password={watchedPassword} />
                <div className="text-xs text-stone-500 mt-1 flex flex-col gap-1">
                  <p className="font-medium">Critères attendus :</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      {watchedPassword.length >= 8 ? <CheckCircle className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-stone-400" />}
                      <span>8 caractères minimum</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {/[A-Z]/.test(watchedPassword) ? <CheckCircle className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-stone-400" />}
                      <span>Au moins une majuscule</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {/[0-9]/.test(watchedPassword) ? <CheckCircle className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-stone-400" />}
                      <span>Au moins un chiffre</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {/[^A-Za-z0-9]/.test(watchedPassword) ? <CheckCircle className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-stone-400" />}
                      <span>Au moins un caractère spécial (!@#$%^&*)</span>
                    </li>
                  </ul>
                </div>
                <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" icon={<Lock className="w-4 h-4" />} error={errors.password_confirm?.message} {...register('password_confirm')} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Boutons de navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">
                Retour
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep} className="flex-1">
                Continuer
              </Button>
            ) : (
              <Button type="submit" loading={isSubmitting} disabled={!isValid} className="flex-1">
                Créer mon compte
              </Button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">Se connecter</Link>
        </p>
      </motion.div>
    </>
  )
}