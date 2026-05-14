import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ThemeProvider } from './contexts/ThemeContext'
import './index.css'

// ── Désinscrire tout Service Worker orphelin ──────────────────────────────
// Ce projet n'utilise pas de SW. Si le navigateur en a mis un en cache
// (session précédente, Vite PWA plugin, autre projet sur localhost:5173),
// il intercepte les requêtes Unsplash et provoque des erreurs réseau.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister())
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <App />
                <Toaster
                  position="top-right"
                  richColors
                  expand
                  closeButton
                />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)