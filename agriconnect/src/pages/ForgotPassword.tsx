import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { authService } from "../services/auth";

const schema = z.object({ email: z.string().email("Email invalide") });
type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.requestPasswordReset(data.email);
      toast.success("Email envoyé ! Vérifiez votre boîte de réception.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string; error?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
        "Erreur lors de l'envoi. Vérifiez votre email.";
      toast.error(msg);
    }
  };

  return (
    <>
      <Helmet>
        <title>Mot de passe oublié – AgriConnect</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">
          Mot de passe oublié ?
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mb-8">
          Entrez votre email et nous vous enverrons un lien de réinitialisation
          valable 24h.
        </p>

        {isSubmitSuccessful ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center"
          >
            <div className="text-5xl mb-3">📧</div>
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2 text-lg">
              Email envoyé !
            </h3>
            <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
              Vérifiez votre boîte de réception (et vos spams). Le lien est
              valable pendant <strong>24 heures</strong>.
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-3">
              Le lien vous redirigera vers la page de réinitialisation.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Adresse email"
              type="email"
              placeholder="jean@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Envoyer le lien de réinitialisation
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-stone-500 mt-6">
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            ← Retour à la connexion
          </Link>
        </p>
      </motion.div>
    </>
  );
}
