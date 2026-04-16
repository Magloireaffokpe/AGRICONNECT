import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types'
import { PageLoader } from '../components/shared/Loader'

interface Props {
  allowedRoles: UserRole[]
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user && !allowedRoles.includes(user.role)) {
    const redirect = user.role === 'FARMER' ? '/dashboard' : '/products'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
