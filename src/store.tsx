import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { bikes } from './data'

export type Toast = { id: number; msg: string; type: 'success' | 'error' }
export type CartLine = { id: string; qty: number; durasi: number }

type Shop = {
  wish: Set<string>
  toggleWish: (id: string) => void
  cart: CartLine[]
  setCart: React.Dispatch<React.SetStateAction<CartLine[]>>
  addCart: (id: string, durasi?: number, qty?: number) => void
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  cartCount: number
  cartTotal: number
  toasts: Toast[]
  pushToast: (msg: string, type?: Toast['type']) => void
  live: number
}

const ShopCtx = createContext<Shop | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [wish, setWish] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [live, setLive] = useState(11)

  useEffect(() => {
    const id = setInterval(() => setLive(v => Math.max(8, v + (Math.random() > 0.5 ? 1 : -1))), 3200)
    return () => clearInterval(id)
  }, [])

  const pushToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  const toggleWish = useCallback((id: string) => {
    setWish(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }, [])

  const addCart = useCallback((id: string, durasi = 2, qty = 1) => {
    const b = bikes.find(x => x.id === id)
    if (!b || b.status !== 'Tersedia') { pushToast('Sepeda sedang disewa', 'error'); return }
    setCart(c => {
      const ex = c.find(x => x.id === id)
      if (ex) return c.map(x => x.id === id ? { ...x, qty: Math.min(6, x.qty + qty) } : x)
      return [...c, { id, qty, durasi }]
    })
    pushToast(`${b.nama} masuk keranjang`)
  }, [pushToast])

  const cartCount = cart.reduce((a, b) => a + b.qty, 0)
  const cartTotal = useMemo(() => cart.reduce((s, c) => {
    const b = bikes.find(x => x.id === c.id)
    return s + (b ? b.hargaJam * c.durasi * c.qty : 0)
  }, 0), [cart])

  const value = useMemo(() => ({
    wish, toggleWish, cart, setCart, addCart, cartOpen, setCartOpen,
    cartCount, cartTotal, toasts, pushToast, live,
  }), [wish, toggleWish, cart, addCart, cartOpen, cartCount, cartTotal, toasts, pushToast, live])

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>
}

export function useShop() {
  const s = useContext(ShopCtx)
  if (!s) throw new Error('useShop harus di dalam ShopProvider')
  return s
}
