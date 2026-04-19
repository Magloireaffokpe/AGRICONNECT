import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { AuthLayout } from "../components/layout/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword")); // ✅ ajout

// Pages publiques (accessibles sans connexion)
const Products = lazy(() => import("../pages/Products"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));

const Cart = lazy(() => import("../pages/Cart"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const OrderDetail = lazy(() => import("../pages/OrderDetail"));
const MyReviews = lazy(() => import("../pages/MyReviews"));
const Deliveries = lazy(() => import("../pages/Deliveries"));
const Profile = lazy(() => import("../pages/Profile"));
const FarmerDashboard = lazy(() => import("../pages/FarmerDashboard"));
const MyProducts = lazy(() => import("../pages/MyProducts"));
const FarmerOrders = lazy(() => import("../pages/FarmerOrders"));
const FarmerReviews = lazy(() => import("../pages/FarmerReviews"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const AppRoutes = () => (
  <Routes>
    {/* Routes sans layout (authentification + réinitialisation) */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />{" "}
      {/* ✅ route publique */}
    </Route>

    {/* Routes avec layout principal */}
    <Route element={<MainLayout />}>
      {/* Pages publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* Acheteur */}
      <Route element={<ProtectedRoute allowedRoles={["BUYER"]} />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-orders/:id" element={<OrderDetail />} />
        <Route path="/my-reviews" element={<MyReviews />} />
      </Route>

      {/* Agriculteur & Admin (livraisons) */}
      <Route element={<ProtectedRoute allowedRoles={["FARMER", "ADMIN"]} />}>
        <Route path="/deliveries" element={<Deliveries />} />
      </Route>

      {/* Agriculteur */}
      <Route element={<ProtectedRoute allowedRoles={["FARMER"]} />}>
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/farmer-orders" element={<FarmerOrders />} />
        <Route path="/farmer-reviews" element={<FarmerReviews />} />
      </Route>

      {/* Tous les authentifiés */}
      <Route
        element={<ProtectedRoute allowedRoles={["BUYER", "FARMER", "ADMIN"]} />}
      >
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  </Routes>
);
