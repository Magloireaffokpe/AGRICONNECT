import { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '../types'
import { toast } from 'sonner'

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        // Produit déjà dans le panier : augmentation de la quantité
        const newQuantity = Math.min(existing.quantity + quantity, product.quantity_available)
        if (newQuantity === existing.quantity) {
          toast.warning(`Stock insuffisant. Maximum ${product.quantity_available} disponibles.`)
          return prev
        }
        toast.success(`Quantité augmentée : ${product.name} (${newQuantity})`, {
          action: { label: 'Voir panier', onClick: () => window.location.href = '/cart' }
        })
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      } else {
        // Nouveau produit
        if (quantity > product.quantity_available) {
          toast.error(`Stock insuffisant. Seulement ${product.quantity_available} disponibles.`)
          return prev
        }
        toast.success(`${product.name} ajouté au panier`, {
          action: { label: 'Voir panier', onClick: () => window.location.href = '/cart' }
        })
        return [...prev, { product, quantity }]
      }
    })
  }

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
    toast.info('Produit retiré du panier')
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.quantity_available) }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    toast.info('Panier vidé')
  }

  const totalPrice = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}