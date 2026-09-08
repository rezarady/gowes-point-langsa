import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { bikes, packageById, initialUnits, slotOf, overlap, type UnitStatus, type BikeUnit } from './data'

export type Toast = { id: number; msg: string; type: 'success' | 'error' }
export type CartLine = { id: string; qty: number; paket: string }
export type BookingStatus = 'baru' | 'dikonfirmasi' | 'selesai' | 'batal'
export type Booking = {
  id: string; nama: string; wa: string; email: string; sepedaId: string; sepedaNama: string;
  paketId: string; paketLabel: string; total: number; tgl: string; jam: string;
  lokasi: string; catatan: string; status: BookingStatus; dibuat: string;
  qty: number; unitIds: string[];
}

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'gowes123'
const LS_BOOKINGS = 'gpl_bookings'
const LS_ADMIN = 'gpl_admin'
const LS_UNITS = 'gpl_units'

function loadBookings(): Booking[] {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_BOOKINGS) || '[]') as Booking[]
    return raw.map(b => ({
      ...b,
      qty: typeof b.qty === 'number' && b.qty > 0 ? b.qty : 1,
      unitIds: Array.isArray(b.unitIds) ? b.unitIds : [],
    }))
  } catch { return [] }
}

function loadUnits(): Record<string, UnitStatus> {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_UNITS) || '{}')
    const ok: Record<string, UnitStatus> = {}
    for (const u of initialUnits) {
      ok[u.uid] = raw[u.uid] === 'disewa' || raw[u.uid] === 'servis' ? raw[u.uid] : 'tersedia'
    }
    return ok
  } catch {
    return Object.fromEntries(initialUnits.map(u => [u.uid, 'tersedia' as UnitStatus]))
  }
}

type Shop = {
  wish: Set<string>
  toggleWish: (id: string) => void
  cart: CartLine[]
  setCart: React.Dispatch<React.SetStateAction<CartLine[]>>
  addCart: (id: string, paket?: string, qty?: number) => void
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  cartCount: number
  cartTotal: number
  toasts: Toast[]
  pushToast: (msg: string, type?: Toast['type']) => void
  live: number
  bookings: Booking[]
  addBooking: (b: Omit<Booking, 'id' | 'status' | 'dibuat' | 'unitIds'>) => Booking
  confirmBooking: (id: string) => string | null
  setBookingStatus: (id: string, s: BookingStatus) => void
  deleteBooking: (id: string) => void
  isAdmin: boolean
  login: (u: string, p: string) => boolean
  logout: () => void
  unitStatus: Record<string, UnitStatus>
  setUnitStatus: (uid: string, s: UnitStatus) => void
  availOf: (typeId: string) => number
  isAvailable: (typeId: string) => boolean
  unitsFree: (typeId: string, tgl: string, start: number, end: number) => BikeUnit[]
  availAt: (typeId: string, tgl: string, hour: number) => number
}

const ShopCtx = createContext<Shop | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [wish, setWish] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [live, setLive] = useState(11)
  const [bookings, setBookings] = useState<Booking[]>(loadBookings)
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(LS_ADMIN) === '1')
  const [unitStatus, setUnitStatusMap] = useState<Record<string, UnitStatus>>(loadUnits)

  useEffect(() => { localStorage.setItem(LS_UNITS, JSON.stringify(unitStatus)) }, [unitStatus])

  const setUnitStatus = useCallback((uid: string, s: UnitStatus) => {
    setUnitStatusMap(prev => ({ ...prev, [uid]: s }))
  }, [])

  const availOf = useCallback((typeId: string) =>
    initialUnits.filter(u => u.typeId === typeId && (unitStatus[u.uid] ?? 'tersedia') === 'tersedia').length,
    [unitStatus])

  const isAvailable = useCallback((typeId: string) => availOf(typeId) > 0, [availOf])

  // Unit yang bebas pada slot tanggal+jam. Stok berkurang saat admin KONFIRMASI:
  // hanya booking 'dikonfirmasi'/'selesai' yang overlap yang memakan unit.
  // Booking 'baru' belum memakan stok. Booking lama tanpa unitIds dianggap menempati 1 unit.
  const unitsFree = useCallback((typeId: string, tgl: string, start: number, end: number): BikeUnit[] => {
    const busy = new Set<string>()
    let legacy = 0
    for (const b of bookings) {
      if ((b.status !== 'dikonfirmasi' && b.status !== 'selesai') || b.tgl !== tgl || b.sepedaId !== typeId) continue
      if (!overlap({ start, end }, slotOf(b.jam, b.paketId))) continue
      if (b.unitIds.length > 0) b.unitIds.forEach(u => busy.add(u))
      else legacy += 1
    }
    const free = initialUnits.filter(u =>
      u.typeId === typeId && (unitStatus[u.uid] ?? 'tersedia') === 'tersedia' && !busy.has(u.uid))
    return free.slice(legacy)
  }, [bookings, unitStatus])

  const availAt = useCallback((typeId: string, tgl: string, hour: number) =>
    unitsFree(typeId, tgl, hour * 60, (hour + 1) * 60).length,
    [unitsFree])

  useEffect(() => {
    const id = setInterval(() => setLive(v => Math.max(8, v + (Math.random() > 0.5 ? 1 : -1))), 3200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => { localStorage.setItem(LS_BOOKINGS, JSON.stringify(bookings)) }, [bookings])

  const pushToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  const toggleWish = useCallback((id: string) => {
    setWish(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }, [])

  const addCart = useCallback((id: string, paket = '2jam', qty = 1) => {
    const b = bikes.find(x => x.id === id)
    const avail = initialUnits.filter(u => u.typeId === id && (unitStatus[u.uid] ?? 'tersedia') === 'tersedia').length
    if (!b || avail <= 0) { pushToast('Sepeda sedang disewa', 'error'); return }
    setCart(c => {
      const ex = c.find(x => x.id === id && x.paket === paket)
      if (ex) return c.map(x => x.id === id && x.paket === paket ? { ...x, qty: Math.min(6, x.qty + qty) } : x)
      return [...c, { id, qty, paket }]
    })
    pushToast(`${b.nama} masuk keranjang`)
  }, [pushToast, unitStatus])

  const addBooking = useCallback((b: Omit<Booking, 'id' | 'status' | 'dibuat' | 'unitIds'>) => {
    // Unit TIDAK langsung dikunci — dikunci otomatis saat admin konfirmasi (confirmBooking).
    const rec: Booking = {
      ...b,
      unitIds: [],
      id: 'GP-' + Date.now().toString(36).toUpperCase(),
      status: 'baru',
      dibuat: new Date().toISOString(),
    }
    setBookings(prev => [rec, ...prev])
    return rec
  }, [])

  // Konfirmasi + kunci unit otomatis. Return pesan error bila stok tak cukup, null bila sukses.
  const confirmBooking = useCallback((id: string): string | null => {
    const b = bookings.find(x => x.id === id)
    if (!b || b.status !== 'baru') return 'Pesanan tidak dalam status baru.'
    const slot = slotOf(b.jam, b.paketId)
    const need = Math.max(1, b.qty)
    const busy = new Set<string>()
    let legacy = 0
    for (const o of bookings) {
      if (o.id === id || (o.status !== 'dikonfirmasi' && o.status !== 'selesai')) continue
      if (o.tgl !== b.tgl || o.sepedaId !== b.sepedaId) continue
      if (!overlap(slot, slotOf(o.jam, o.paketId))) continue
      if (o.unitIds.length > 0) o.unitIds.forEach(u => busy.add(u))
      else legacy += 1
    }
    const free = initialUnits
      .filter(u => u.typeId === b.sepedaId && (unitStatus[u.uid] ?? 'tersedia') === 'tersedia' && !busy.has(u.uid))
      .slice(legacy)
      .slice(0, need)
      .map(u => u.uid)
    if (free.length < need) return `Stok ${b.sepedaNama} kurang (butuh ${need}, sisa ${free.length}) pada ${b.tgl} pukul ${b.jam}.`
    setBookings(prev => prev.map(o => o.id === id ? { ...o, unitIds: free, status: 'dikonfirmasi' as BookingStatus } : o))
    return null
  }, [bookings, unitStatus])

  const setBookingStatus = useCallback((id: string, s: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: s } : b))
  }, [])

  const deleteBooking = useCallback((id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }, [])

  const login = useCallback((u: string, p: string) => {
    const ok = u.trim().toLowerCase() === ADMIN_USER && p === ADMIN_PASS
    if (ok) { localStorage.setItem(LS_ADMIN, '1'); setIsAdmin(true) }
    return ok
  }, [])

  const logout = useCallback(() => { localStorage.removeItem(LS_ADMIN); setIsAdmin(false) }, [])

  const cartCount = cart.reduce((a, b) => a + b.qty, 0)
  const cartTotal = useMemo(() => cart.reduce((s, c) => s + packageById(c.paket).price * c.qty, 0), [cart])

  const value = useMemo(() => ({
    wish, toggleWish, cart, setCart, addCart, cartOpen, setCartOpen,
    cartCount, cartTotal, toasts, pushToast, live,
    bookings, addBooking, confirmBooking, setBookingStatus, deleteBooking,
    isAdmin, login, logout,
    unitStatus, setUnitStatus, availOf, isAvailable,
    unitsFree, availAt,
  }), [wish, toggleWish, cart, addCart, cartOpen, cartCount, cartTotal, toasts, pushToast, live, bookings, addBooking, confirmBooking, setBookingStatus, deleteBooking, isAdmin, login, logout, unitStatus, setUnitStatus, availOf, isAvailable, unitsFree, availAt])

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>
}

export function useShop() {
  const s = useContext(ShopCtx)
  if (!s) throw new Error('useShop harus di dalam ShopProvider')
  return s
}
