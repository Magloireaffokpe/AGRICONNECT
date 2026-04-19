import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { User, Lock, BadgeCheck, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { PasswordStrength } from "../components/shared/PasswordStrength";
import { getInitials } from "../utils/helpers";

const pwSchema = z
  .object({
    old_password: z.string().min(1, "Requis"),
    new_password: z
      .string()
      .min(8, "8 caractères minimum")
      .regex(/[A-Z]/, "Une majuscule requise")
      .regex(/[0-9]/, "Un chiffre requis")
      .regex(/[^A-Za-z0-9]/, "Un caractère spécial requis"),
    new_password_confirm: z.string(),
  })
  .refine((d) => d.new_password === d.new_password_confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["new_password_confirm"],
  });

type PwForm = z.infer<typeof pwSchema>;

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "security">("info");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PwForm>({
    resolver: zodResolver(pwSchema),
  });

  const newPw = watch("new_password") || "";

  const onSubmitPw = async (data: PwForm) => {
    try {
      await authService.changePassword(data);
      toast.success("Mot de passe modifié avec succès !");
      reset();
    } catch (err: unknown) {
      const resp = (err as { response?: { data?: Record<string, string[]> } })
        ?.response?.data;
      const msg = resp
        ? Object.values(resp).flat()[0]
        : "Erreur lors du changement";
      toast.error(msg);
    }
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Mon profil – AgriConnect</title>
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl font-bold text-green-700 dark:text-green-400">
              {getInitials(user.full_name || user.email)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                {user.full_name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    user.role === "FARMER"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {user.role === "FARMER" ? "👨‍🌾 Agriculteur" : "🛒 Acheteur"}
                </span>
                {user.farmer_profile?.verified && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Vérifié
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-6">
            {[
              {
                key: "info",
                label: "Informations",
                icon: <User className="w-4 h-4" />,
              },
              {
                key: "security",
                label: "Sécurité",
                icon: <Lock className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 shadow-sm"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Info tab */}
          {activeTab === "info" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card padding="lg">
                <h2 className="font-semibold text-stone-800 dark:text-stone-100 mb-5">
                  Informations personnelles
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Mail className="w-4 h-4" />,
                      label: "Email",
                      value: user.email,
                    },
                    {
                      icon: <Phone className="w-4 h-4" />,
                      label: "Téléphone",
                      value: user.phone || "—",
                    },
                    {
                      icon: <MapPin className="w-4 h-4" />,
                      label: "Localisation",
                      value: user.location || "—",
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="flex items-center gap-3 py-3 border-b border-stone-100 dark:border-stone-800 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                        {field.icon}
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-0.5">
                          {field.label}
                        </p>
                        <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
                          {field.value}
                        </p>
                      </div>
                    </div>
                  ))}

                  {user.farmer_profile && (
                    <div className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                        🌾
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-0.5">Ferme</p>
                        <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
                          {user.farmer_profile.farm_name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card padding="lg">
                <h2 className="font-semibold text-stone-800 dark:text-stone-100 mb-5">
                  Changer le mot de passe
                </h2>
                <form onSubmit={handleSubmit(onSubmitPw)} className="space-y-5">
                  <Input
                    label="Mot de passe actuel"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.old_password?.message}
                    {...register("old_password")}
                  />
                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.new_password?.message}
                    {...register("new_password")}
                  />
                  <PasswordStrength password={newPw} />
                  <Input
                    label="Confirmer le nouveau mot de passe"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.new_password_confirm?.message}
                    {...register("new_password_confirm")}
                  />
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="w-full"
                  >
                    Mettre à jour le mot de passe
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
