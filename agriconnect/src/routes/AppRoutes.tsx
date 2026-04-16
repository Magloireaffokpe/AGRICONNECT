import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import { AuthLayout } from '../components/layout/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Lazy pages
const Home = lazy(() => import('../pages/Home'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const Products = lazy(() => import('../pages/Products'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const Cart = lazy(() => import('../pages/Cart'))
const MyOrders = lazy(() => import('../pages/MyOrders'))
const OrderDetail = lazy(() => import('../pages/OrderDetail'))
const MyReviews = lazy(() => import('../pages/MyReviews'))
const Delivery = lazy(() => import('../pages/Delivery'))
const Profile = lazy(() => import('../pages/Profile'))
const FarmerDashboard = lazy(() => import('../pages/FarmerDashboard'))
const MyProducts = lazy(() => import('../pages/MyProducts'))
const FarmerOrders = lazy(() => import('../pages/FarmerOrders'))
const NotFound = lazy(() => import('../pages/NotFound'))

export const AppRoutes = () => (
  <Routes>
    {/* Auth layout */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Route>

    {/* Main layout */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* Buyer protected */}
      <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-orders/:id" element={<OrderDetail />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/delivery" element={<Delivery />} />
      </Route>

      {/* Farmer protected */}
      <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/farmer-orders" element={<FarmerOrders />} />
      </Route>

      {/* Any authenticated */}
      <Route element={<ProtectedRoute allowedRoles={['BUYER', 'FARMER', 'ADMIN']} />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  </Routes>
)
