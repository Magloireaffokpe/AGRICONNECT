import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
type FormData = z.infer<typeof schema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      toast.success('Connexion réussie !')
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      toast.error(msg || 'Email ou mot de passe incorrect')
    }
  }

  return (
    <>
      <Helmet><title>Connexion – AgriConnect</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Bon retour ! 👋</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-8">Connectez-vous à votre compte AgriConnect</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Adresse email"
            type="email"
            placeholder="jean@example.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <div>
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="mt-1 text-right">
              <Link to="/forgot-password" className="text-xs text-green-600 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            S'inscrire gratuitement
          </Link>
        </p>
      </motion.div>
    </>
  )
}
