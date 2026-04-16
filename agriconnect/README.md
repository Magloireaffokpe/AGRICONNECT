# 🌾 AgriConnect – Frontend

> Marketplace agricole connectant farmers et acheteurs — React 18 + TypeScript + Tailwind CSS

---

## ✨ Aperçu

AgriConnect est une application web premium permettant :
- Aux **agriculteurs** de publier leurs produits, gérer leurs stocks et suivre leurs commandes
- Aux **acheteurs** de parcourir le catalogue, commander et laisser des avis

---

## 🚀 Lancement rapide

```bash
# 1. Cloner le projet
git clone <repo-url>
cd agriconnect

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec l'URL de votre backend

# 4. Démarrer en développement
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

---

## 🏗️ Stack technique

| Outil | Rôle |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Bundler & dev server |
| TanStack Query v5 | Data fetching & cache |
| React Router DOM v6 | Routing |
| React Hook Form + Zod | Formulaires & validation |
| Tailwind CSS | Styling |
| Headless UI | Composants accessibles (Modal) |
| Framer Motion | Animations |
| Sonner | Toasts |
| Recharts | Graphiques |
| Lucide React | Icônes |
| React Helmet Async | SEO (balises `<title>`) |
| Axios | HTTP client + intercepteurs JWT |

---

## 📁 Structure du projet

```
src/
├── components/
│   ├── ui/           # Design system : Button, Input, Card, Badge, Modal, Skeleton, StarRating, Select
│   ├── layout/       # Navbar, Footer, MainLayout, AuthLayout
│   └── shared/       # Loader, EmptyState, ErrorBoundary, PasswordStrength
├── pages/            # Routes : Home, Login, Register, Products, Cart, Dashboard…
├── features/
│   ├── products/     # ProductCard
│   └── reviews/      # ReviewForm
├── hooks/            # useProducts, useOrders, useReviews, useDebounce
├── services/         # auth, products, orders, reviews, delivery, admin
├── contexts/         # AuthContext, CartContext, ThemeContext
├── types/            # Types TypeScript globaux
├── utils/            # cn, helpers (formatPrice, imageUrl, etc.)
├── routes/           # AppRoutes, ProtectedRoute
└── lib/              # axios.ts (intercepteurs), queryClient.ts
```

---

## 🔐 Authentification

- **JWT** via `localStorage` (`access_token`, `refresh_token`)
- **Intercepteur Axios** : attache le token à chaque requête
- **Refresh automatique** sur 401 sans déconnexion
- **Rôles** : `FARMER` → dashboard/produits/commandes farmer | `BUYER` → catalogue/panier/commandes buyer

---

## 🎨 Design system

Palette :
- Vert profond : `#166534` (green-800)
- Vert vif : `#22c55e` (green-500)
- Beige : `#fef3c7` (amber-100)
- Blanc cassé : `#fafaf9` (stone-50)

Composants : `Button`, `Input`, `Card`, `Badge`, `StatusBadge`, `Modal`, `Skeleton`, `StarRating`, `Select`

---

## 🌙 Dark mode

Persisté dans `localStorage`. Toggle via le bouton 🌙/☀️ dans la navbar.

---

## 📡 Variables d'environnement

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_NAME=AgriConnect
```

---

## 📦 Build production

```bash
npm run build
npm run preview
```

---

## 📌 Notes développement

- **Mot de passe oublié** : en dev, le lien est loggué dans la console navigateur
- **Images produits** : upload via `multipart/form-data`, prévisualisation côté client
- **Pagination** : 12 résultats/page, paramètre `?page=N`
- **Recherche** : debounce 400ms sur le champ de recherche

---

## 👤 Comptes de test

Créer des comptes via `/register` ou via l'API :

```bash
# Acheteur
POST /api/auth/register/
{ "email": "buyer@test.com", "role": "BUYER", "password": "Test@1234", ... }

# Agriculteur
POST /api/auth/register/
{ "email": "farmer@test.com", "role": "FARMER", "farm_name": "Ma Ferme", ... }
```

---

*Développé avec ❤️ pour AgriConnect*
