import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  ClipboardList,
  Star,
  Truck,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getInitials } from "../../utils/helpers";

const farmerLinks = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/my-products", label: "Mes produits", icon: Package },
  { to: "/farmer-orders", label: "Commandes", icon: ClipboardList },
  { to: "/deliveries", label: "Livraisons", icon: Truck },
  { to: "/farmer-reviews", label: "Avis", icon: Star },
];

const buyerLinks = [
  { to: "/products", label: "Catalogue", icon: Package },
  { to: "/my-orders", label: "Mes commandes", icon: ClipboardList },
  { to: "/my-reviews", label: "Mes avis", icon: Star },
];

const guestLinks = [{ to: "/products", label: "Catalogue", icon: Package }];

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = user?.role === "FARMER" ? farmerLinks : buyerLinks;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          HEADER FIXE
          ═══════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-stone-950/95 backdrop-blur-md shadow-sm border-b border-stone-100 dark:border-stone-800"
            : "bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg text-green-700 dark:text-green-400 shrink-0"
            >
              <span className="text-2xl leading-none">🌾</span>
              <span className="hidden sm:block">AgriConnect</span>
            </Link>

            {/* Desktop nav — authenticated */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-0.5">
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        active
                          ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Desktop nav — guest */}
            {!isAuthenticated && (
              <nav className="hidden md:flex items-center gap-0.5">
                <Link
                  to="/products"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    location.pathname === "/products"
                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Catalogue
                </Link>
              </nav>
            )}

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Thème"
                className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="w-[18px] h-[18px]" />
                ) : (
                  <Sun className="w-[18px] h-[18px]" />
                )}
              </button>

              {/* Cart — buyer only */}
              {isAuthenticated && user?.role === "BUYER" && (
                <Link
                  to="/cart"
                  aria-label="Panier"
                  className="relative p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key="b"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                      >
                        {totalItems > 9 ? "9+" : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {/* Desktop: profile dropdown */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/60 flex items-center justify-center text-green-700 dark:text-green-300 text-xs font-bold shrink-0">
                      {getInitials(user?.full_name || user?.email || "?")}
                    </div>
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-300 max-w-[100px] truncate">
                      {user?.first_name}
                    </span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800">
                          <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">
                            {user?.full_name}
                          </p>
                          <p className="text-xs text-stone-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-stone-400" /> Mon profil
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Desktop: auth buttons */
                <div className="hidden md:flex items-center gap-2 ml-1">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-green-700 transition-colors"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 text-sm font-semibold bg-green-700 hover:bg-green-800 text-white rounded-xl transition-colors shadow-sm"
                  >
                    S'inscrire
                  </button>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
                className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <motion.div
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          MOBILE DRAWER
          ═══════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            {/* Drawer — hauteur 100dvh pour couvrir les barres mobiles */}
            <motion.div
              key="dr"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="md:hidden fixed top-0 right-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-stone-950 shadow-2xl"
              style={{
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ── En-tête drawer ── */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800"
                style={{ flexShrink: 0 }}
              >
                <span className="font-bold text-lg text-green-700 dark:text-green-400">
                  🌾 AgriConnect
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ── Info utilisateur ── */}
              {isAuthenticated && user && (
                <div
                  className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 bg-green-50 dark:bg-green-900/20"
                  style={{ flexShrink: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/60 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm"
                      style={{ flexShrink: 0 }}
                    >
                      {getInitials(user.full_name || user.email)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm truncate">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-stone-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Navigation scrollable ── */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
                {isAuthenticated ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {navLinks.map(({ to, label, icon: Icon }) => {
                      const active = location.pathname === to;
                      return (
                        <Link
                          key={to}
                          to={to}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            active
                              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                          }`}
                        >
                          <Icon className="w-5 h-5" style={{ flexShrink: 0 }} />
                          <span style={{ flex: 1 }}>{label}</span>
                          {active && (
                            <ChevronRight className="w-4 h-4 text-green-500" />
                          )}
                        </Link>
                      );
                    })}
                    {/* Mon profil */}
                    <Link
                      to="/profile"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        location.pathname === "/profile"
                          ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                      }`}
                    >
                      <User className="w-5 h-5" style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>Mon profil</span>
                    </Link>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {guestLinks.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          location.pathname === to
                            ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span style={{ flex: 1 }}>{label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ══════════════════════════════════════
                  BOUTONS BAS — TOUJOURS VISIBLES
                  Utilise style inline pour garantir
                  qu'ils ne sont jamais coupés sur iOS
                  ══════════════════════════════════════ */}
              <div
                style={{
                  flexShrink: 0,
                  padding: "12px 16px",
                  borderTop: "1px solid",
                  borderColor: "var(--color-border, #e5e7eb)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  /* Safe area iOS */
                  paddingBottom: "max(12px, env(safe-area-inset-bottom))",
                }}
                className="border-stone-100 dark:border-stone-800"
              >
                {isAuthenticated ? (
                  /* ✅ DÉCONNEXION — bouton rouge bien visible */
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "1.5px solid #fca5a5",
                      backgroundColor: "transparent",
                      color: "#dc2626",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:border-red-800 transition-colors"
                  >
                    <LogOut style={{ width: "16px", height: "16px" }} />
                    Déconnexion
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "1.5px solid #d6d3d1",
                        backgroundColor: "transparent",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      className="text-stone-700 dark:text-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      Connexion
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setMenuOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "none",
                        backgroundColor: "#15803d",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      className="hover:bg-green-800 transition-colors"
                    >
                      S'inscrire gratuitement
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};
