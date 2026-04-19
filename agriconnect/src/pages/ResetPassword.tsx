import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Lock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { PasswordStrength } from "../components/shared/PasswordStrength";
import { checkPasswordStrength } from "../utils/helpers";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Décoder proprement le token depuis l'URL
  // Le quoted-printable peut encoder "=" en "=3D" — on nettoie ça ici
  const rawToken = searchParams.get("token") ?? "";
  // decodeURIComponent gère les %XX, et on retire les espaces parasites
  const token = decodeURIComponent(rawToken).trim();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const checks = checkPasswordStrength(password);
  const passwordValid = Object.values(checks).every(Boolean);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token invalide ou manquant dans l'URL");
      return;
    }
    if (!passwordValid) {
      toast.error("Le mot de passe ne respecte pas les critères de sécurité");
      return;
    }
    if (!passwordsMatch) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      await authService.confirmPasswordReset({
        token,
        new_password: password,
        new_password_confirm: confirmPassword,
      });
      setSuccess(true);
      toast.success("Mot de passe modifié avec succès !");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string> } })
        ?.response?.data;
      const msg =
        data?.error ||
        data?.message ||
        data?.token ||
        "Lien invalide ou expiré. Demandez un nouveau lien.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Token absent dans l'URL
  if (!token) {
    return (
      <>
        <Helmet>
          <title>Lien invalide – AgriConnect</title>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-3">
            Lien invalide
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8 text-sm leading-relaxed">
            Ce lien de réinitialisation est invalide ou a expiré. Demandez un
            nouveau lien depuis la page "Mot de passe oublié".
          </p>
          <Button
            onClick={() => navigate("/forgot-password")}
            className="w-full mb-3"
          >
            Demander un nouveau lien
          </Button>
          <Link to="/login" className="text-sm text-green-600 hover:underline">
            ← Retour à la connexion
          </Link>
        </motion.div>
      </>
    );
  }

  // Succès
  if (success) {
    return (
      <>
        <Helmet>
          <title>Mot de passe modifié – AgriConnect</title>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-3">
            Mot de passe modifié !
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
            Vous allez être redirigé vers la connexion dans quelques secondes…
          </p>
          <Button onClick={() => navigate("/login")} className="w-full">
            Se connecter maintenant
          </Button>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Nouveau mot de passe – AgriConnect</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-4xl mb-4">🔑</div>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">
          Nouveau mot de passe
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mb-8 text-sm">
          Choisissez un mot de passe sécurisé pour votre compte AgriConnect.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nouveau mot de passe */}
          <Input
            label="Nouveau mot de passe"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Barre de force */}
          {password && <PasswordStrength password={password} />}

          {/* Critères visuels */}
          {password && (
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { ok: checks.length, label: "8 caractères min" },
                { ok: checks.uppercase, label: "Une majuscule" },
                { ok: checks.digit, label: "Un chiffre" },
                { ok: checks.special, label: "Un caractère spécial" },
              ].map(({ ok, label }) => (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 ${ok ? "text-green-600 dark:text-green-400" : "text-stone-400"}`}
                >
                  {ok ? (
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  {label}
                </div>
              ))}
            </div>
          )}

          {/* Confirmation */}
          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={
              confirmPassword && !passwordsMatch
                ? "Les mots de passe ne correspondent pas"
                : undefined
            }
          />

          {/* Indicateur de correspondance */}
          {confirmPassword && passwordsMatch && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Les mots de passe correspondent
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={!passwordValid || !passwordsMatch}
            className="w-full"
            size="lg"
          >
            Modifier mon mot de passe
          </Button>
        </form>

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
