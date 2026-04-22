import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";
import { PageLoader } from "../components/shared/Loader";

interface Props {
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // ✅ Attendre la vérification du token UNIQUEMENT ici (pages protégées)
  // Les pages publiques (Products, ProductDetail) n'utilisent pas ProtectedRoute
  // donc elles ne sont jamais bloquées par ce loader.
  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    // Sauvegarder la page tentée pour redirect après login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Mauvais rôle → rediriger vers la page d'accueil du bon rôle
    const redirect = user.role === "FARMER" ? "/dashboard" : "/products";
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
};
