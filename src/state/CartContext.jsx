import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'cafeteria-carrito'

function readCart() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// El carrito guarda una copia de código, nombre y precio para armar el mensaje de WhatsApp.
export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* sin almacenamiento: el carrito vive solo en esta pestaña */
    }
  }, [items])

  const api = useMemo(
    () => ({
      add(product, qty = 1) {
        setItems((list) => {
          const found = list.find((it) => it.code === product.code)
          if (found) return list.map((it) => (it.code === product.code ? { ...it, qty: it.qty + qty } : it))
          return [...list, { code: product.code, name: product.name, price: product.price, imageUrl: product.imageUrl, qty }]
        })
      },
      setQty(code, qty) {
        setItems((list) =>
          qty <= 0 ? list.filter((it) => it.code !== code) : list.map((it) => (it.code === code ? { ...it, qty } : it))
        )
      },
      clear: () => setItems([]),
    }),
    []
  )

  const count = items.reduce((n, it) => n + it.qty, 0)
  const total = items.reduce((n, it) => n + it.qty * it.price, 0)

  return (
    <CartContext.Provider value={{ items, count, total, open, setOpen, ...api }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
