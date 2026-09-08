import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bike, Search, Menu, X, Sun, Moon, MessageCircle, ShoppingBag,
  Plus, Minus, Trash2, Check, AlertCircle, ArrowRight, MapPin, Phone, Mail, Share2,
} from 'lucide-react'
import { bikes, fmt, waLink, WA_DISPLAY, PACKAGES, packageById, slotOf, type BikeItem } from '../data'

export const logoUrl = `${import.meta.env.BASE_URL}logo.jpeg`
import { useShop } from '../store'

// Navigasi antar-page + scroll ke section di Beranda
export function useGoSection() {
  const nav = useNavigate()
  const loc = useLocation()
  return (id: string) => {
    if (loc.pathname !== '/') nav('/', { state: { scroll: id } })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  }, [dark])
  return { dark, setDark }
}

export function Header() {
  const { cartCount, live, setCartOpen } = useShop()
  const { dark, setDark } = useDark()
  const [menu, setMenu] = useState(false)
  const go = useGoSection()
  const nav = useNavigate()
  const goPage = (to: string) => { setMenu(false); nav(to) }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-zinc-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center gap-3">
        <a href="#/" onClick={e => { e.preventDefault(); goPage('/') }} className="flex items-center gap-2.5">
          <img src={logoUrl} alt="Gowes Point Langsa" className="w-9 h-9 rounded-xl object-cover shadow-md bg-white" />
          <span className="hidden sm:block font-extrabold text-[16px] tracking-tight leading-none">Gowes Point<br /><span className="text-emerald-600 font-bold text-[12px] tracking-widest uppercase">Langsa</span></span>
        </a>
        <nav className="hidden lg:flex items-center gap-0.5 ml-4 text-[13px] font-medium whitespace-nowrap">
          <button onClick={() => goPage('/')} className="px-3 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Beranda</button>
          <button onClick={() => go('daftar-sepeda')} className="px-3 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Daftar Sepeda</button>
          <button onClick={() => go('cara-sewa')} className="px-3 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Cara Sewa</button>
          <button onClick={() => go('lokasi')} className="px-3 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Lokasi</button>
          <button onClick={() => goPage('/pemesanan')} className="px-3 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Pemesanan</button>
        </nav>
        <div className="flex-1" />
        <span className="hidden xl:inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {bikes.filter(b => b.status === 'Tersedia').length} tersedia • {live} melihat
        </span>
        <button aria-label="Toggle tema" onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button aria-label="Keranjang" onClick={() => setCartOpen(true)} className="relative w-9 h-9 rounded-full bg-emerald-600 text-white grid place-items-center shadow-sm hover:bg-emerald-700 transition">
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] min-w-4 h-4 px-1 rounded-full grid place-items-center font-extrabold">{cartCount}</span>}
        </button>
        <button onClick={() => goPage('/pemesanan')} className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-full shadow-sm transition text-sm">Pesan Sekarang <ArrowRight className="w-4 h-4" /></button>
        <button aria-label="Menu" onClick={() => setMenu(v => !v)} className="lg:hidden w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center">
          {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="px-4 py-4 flex flex-col gap-1">
              <button onClick={() => goPage('/')} className="text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium">Beranda</button>
              <button onClick={() => { setMenu(false); go('daftar-sepeda') }} className="text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium">Daftar Sepeda</button>
              <button onClick={() => { setMenu(false); go('cara-sewa') }} className="text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium">Cara Sewa</button>
              <button onClick={() => { setMenu(false); go('lokasi') }} className="text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium">Lokasi</button>
              <button onClick={() => goPage('/pemesanan')} className="mt-2 bg-emerald-600 text-white font-semibold py-3 rounded-full">Pemesanan</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Footer() {
  const go = useGoSection()
  const nav = useNavigate()
  return (
    <footer className="mt-10 bg-zinc-900 text-zinc-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <img src={logoUrl} alt="Gowes Point Langsa" className="w-9 h-9 rounded-xl object-cover bg-white" />
              <span className="font-extrabold leading-none">Gowes Point<br /><span className="text-emerald-400 text-xs tracking-widest">LANGSA</span></span>
            </div>
            <p className="text-sm leading-relaxed mt-3 text-zinc-400">Sewa sepeda mudah, nyaman, dan terjangkau untuk menikmati Kota Langsa dengan dua roda.</p>
            <div className="flex gap-2 mt-4">
              {[0, 1, 2].map(i => <a key={i} href="#" aria-label="Media sosial" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Share2 className="w-4 h-4" /></a>)}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><button onClick={() => nav('/')} className="hover:text-white">Beranda</button></li>
              <li><button onClick={() => go('daftar-sepeda')} className="hover:text-white">Daftar Sepeda</button></li>
              <li><button onClick={() => nav('/pemesanan')} className="hover:text-white">Pemesanan</button></li>
              <li><button onClick={() => go('lokasi')} className="hover:text-white">Lokasi</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Kontak</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> Jl. A. Yani No.45, Langsa</li>
              <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5" /> {WA_DISPLAY}</li>
              <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5" /> halo@gowespoint.id</li>
              <li>Jam: 06.00–18.00 WIB</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-white">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-white">Syarat dan Ketentuan</a></li>
              <li><a href="#" className="hover:text-white">Kebijakan Refund</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-wrap justify-between gap-3 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Gowes Point Langsa. Seluruh hak cipta dilindungi.</span>
          <span>Dibuat dengan ♥ di Kota Langsa, Aceh • <a href="#/admin/login" className="hover:text-zinc-300">Admin</a></span>
        </div>
      </div>
    </footer>
  )
}

export function Toasts() {
  const { toasts } = useShop()
  return (
    <div className="fixed bottom-20 lg:bottom-5 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none w-max max-w-[92vw]">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} className={`pointer-events-auto px-5 py-3 rounded-full shadow-xl text-sm font-bold flex items-center gap-2 ${t.type === 'success' ? 'bg-zinc-900 text-white' : 'bg-rose-600 text-white'}`}>
            {t.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4" />} {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function BottomNav() {
  const go = useGoSection()
  const nav = useNavigate()
  const { cartCount, setCartOpen } = useShop()
  const items = [
    { l: 'Beranda', ico: Bike, fn: () => nav('/') },
    { l: 'Katalog', ico: Search, fn: () => go('daftar-sepeda') },
    { l: 'Keranjang', ico: ShoppingBag, fn: () => setCartOpen(true), badge: cartCount },
    { l: 'Pesan', ico: MessageCircle, fn: () => nav('/pemesanan') },
  ]
  return (
    <nav aria-label="Navigasi utama" className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-t border-zinc-200 dark:border-zinc-800 px-2 py-2 flex justify-around">
      {items.map(b => (
        <button key={b.l} onClick={b.fn} className="flex flex-col items-center gap-1 px-4 py-1 min-w-[44px] min-h-[44px] justify-center">
          <span className="relative"><b.ico className="w-5 h-5" />{b.badge ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] rounded-full grid place-items-center font-bold">{b.badge}</span> : null}</span>
          <span className="text-[11px] font-medium">{b.l}</span>
        </button>
      ))}
    </nav>
  )
}

export function FloatingCartBar() {
  const { cartCount, cartTotal, cartOpen, setCartOpen } = useShop()
  return (
    <AnimatePresence>
      {cartCount > 0 && !cartOpen && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed bottom-16 lg:bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[520px] z-30">
          <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full pl-2 pr-2 py-2 flex items-center gap-3 shadow-2xl border border-white/10 dark:border-zinc-200">
            <span className="bg-emerald-600 text-white w-10 h-10 rounded-full grid place-items-center font-extrabold text-sm shrink-0">{cartCount}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold leading-none truncate">{cartCount} sepeda di keranjang</div>
              <div className="text-xs opacity-70 truncate mt-0.5">{fmt(cartTotal)}</div>
            </div>
            <button onClick={() => setCartOpen(true)} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-extrabold px-5 py-2.5 rounded-full text-sm shrink-0">Lihat</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function CartSheet() {
  const { cart, setCart, cartOpen, setCartOpen, cartCount, cartTotal } = useShop()
  const nav = useNavigate()
  const go = useGoSection()
  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 320 }} className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] bg-white dark:bg-zinc-900 z-50 shadow-2xl flex flex-col rounded-t-[24px] sm:rounded-none max-h-[85vh] sm:max-h-none">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <h3 className="font-extrabold flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Keranjang <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs px-2 py-1 rounded-full">{cartCount}</span></h3>
              <button onClick={() => setCartOpen(false)} aria-label="Tutup keranjang" className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 grid place-items-center mx-auto"><ShoppingBag className="w-6 h-6 text-zinc-400" /></div>
                  <p className="font-extrabold mt-3">Keranjang kosong</p><p className="text-sm text-zinc-500">Tambah dari katalog.</p>
                  <button onClick={() => { setCartOpen(false); go('daftar-sepeda') }} className="mt-4 bg-emerald-600 text-white px-5 py-2.5 rounded-full font-extrabold text-sm">Jelajahi katalog</button>
                </div>
              ) : cart.map(c => {
                const b = bikes.find(x => x.id === c.id)!; return (
                  <div key={c.id} className="flex gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                    <img src={b.gambar} alt={b.nama} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold truncate">{b.nama}</div>
                      <div className="text-xs text-zinc-500">{packageById(c.paket).label} • {fmt(packageById(c.paket).price)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => setCart(v => v.map(x => x.id === c.id && x.paket === c.paket ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} aria-label="Kurangi" className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-extrabold w-8 text-center">{c.qty}</span>
                        <button onClick={() => setCart(v => v.map(x => x.id === c.id && x.paket === c.paket ? { ...x, qty: Math.min(6, x.qty + 1) } : x))} aria-label="Tambah" className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center"><Plus className="w-3 h-3" /></button>
                        <select value={c.paket} onChange={e => setCart(v => v.map(x => x.id === c.id && x.paket === c.paket ? { ...x, paket: e.target.value } : x))} aria-label="Paket" className="ml-auto text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-2 py-1 max-w-[110px]">
                          {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.label} • {fmt(p.price)}</option>)}
                        </select>
                      </div>
                    </div>
                    <button onClick={() => setCart(v => v.filter(x => x.id !== c.id))} aria-label="Hapus" className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 grid place-items-center hover:bg-rose-50 shrink-0"><Trash2 className="w-4 h-4 text-rose-500" /></button>
                  </div>
                )
              })}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3 bg-zinc-50 dark:bg-zinc-900">
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Total</span><span className="font-extrabold text-lg">{fmt(cartTotal)}</span></div>
                <button onClick={() => {
                  const first = cart[0]
                  setCartOpen(false)
                  nav('/pemesanan', { state: { sepeda: first.id, paket: first.paket } })
                }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-full">Checkout • {fmt(cartTotal)} →</button>
                <button onClick={() => setCart([])} className="w-full text-xs font-bold underline text-zinc-500">Kosongkan keranjang</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Drawer detail + wizard waktu (dipakai Beranda)
export function BikeDrawer({ bike, onClose }: { bike: BikeItem; onClose: () => void }) {
  const { addCart, setCartOpen, availOf, isAvailable, unitsFree, pushToast } = useShop()
  const ready = isAvailable(bike.id)
  const nav = useNavigate()
  const [tgl, setTgl] = useState(() => new Date().toISOString().slice(0, 10))
  const [jam, setJam] = useState('08:00')
  const [paket, setPaket] = useState('2jam')
  const [qty, setQty] = useState(1)
  const [step, setStep] = useState<1 | 2>(1)
  const total = packageById(paket).price * qty
  const slot = slotOf(jam, paket)
  const slotFree = unitsFree(bike.id, tgl, slot.start, slot.end).length
  const slotFull = ready && slotFree === 0

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-zinc-900 z-50 shadow-2xl flex flex-col overflow-hidden">
        <div className="h-[220px] relative shrink-0">
          <img src={bike.gambar} alt={bike.nama} className="w-full h-full object-cover" />
          <button onClick={onClose} aria-label="Tutup" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow"><X className="w-5 h-5" /></button>
          <span className={`absolute bottom-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${ready ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{ready ? `Tersedia • ${availOf(bike.id)} unit` : 'Sedang Disewa'}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${step >= 1 ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}>1</span><span className="text-sm font-bold">Waktu</span>
            <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
            <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${step >= 2 ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}>2</span><span className="text-sm font-bold">Ringkasan</span>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-emerald-600">{bike.jenis} • {bike.id}</div>
            <h3 className="font-[Fraunces] text-2xl font-extrabold leading-tight mt-1">{bike.nama}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{bike.deskripsi}</p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2">Spesifikasi</h4>
            <ul className="grid grid-cols-2 gap-2">
              {bike.spesifikasi.map(s => <li key={s} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> {s}</li>)}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800">
              <div className="text-xs text-zinc-500">Harga per jam</div><div className="font-extrabold text-emerald-600 text-lg">{fmt(bike.hargaJam)}</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="text-xs text-zinc-500">Harga per hari</div><div className="font-extrabold text-lg">{fmt(bike.hargaHari)}</div>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-5 space-y-4">
            <h4 className="font-bold text-sm">Atur Penyewaan</h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs">
                <span className="font-medium">Tanggal sewa</span>
                <input type="date" value={tgl} onChange={e => setTgl(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm" />
              </label>
              <div className="space-y-1 text-xs">
                <span className="font-medium">Jam mulai</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {['06:00', '08:00', '10:00', '13:00', '15:00', '16:30'].map(tm => (
                    <button key={tm} onClick={() => setJam(tm)} className={`py-2 rounded-full text-xs font-bold border ${jam === tm ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'}`}>{tm}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 text-xs col-span-2">
                <span className="font-medium">Paket sewa</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {PACKAGES.map(p => (
                    <button key={p.id} onClick={() => setPaket(p.id)} className={`py-2 px-1 rounded-xl text-xs font-bold border ${paket === p.id ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'}`}>
                      {p.label}<span className="block font-medium opacity-70">{fmt(p.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="space-y-1 text-xs col-span-2">
                <span className="font-medium">Jumlah sepeda</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center">−</button>
                  <span className="flex-1 text-center font-bold py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">{qty} unit</span>
                  <button onClick={() => setQty(q => Math.min(6, q + 1))} className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center">+</button>
                </div>
              </label>
            </div>

            <div className="bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-zinc-400"><span>{packageById(paket).label} × {qty} unit</span><span>{fmt(total)}</span></div>
              <div className="flex justify-between font-extrabold text-lg"><span>Total</span><span className="text-emerald-400">{fmt(total)}</span></div>
              <div className="text-[11px] text-zinc-500">Belum termasuk deposit identitas. Pembayaran di lokasi.</div>
            </div>

            {slotFull ? (
              <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <span className="text-rose-700 dark:text-rose-200"><b>Stok habis di jam ini</b> — {bike.nama} penuh pada {tgl} pukul {jam}. Coba tanggal, jam, atau paket lain.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl px-4 py-3 text-sm">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-200">Sisa <b>{slotFree} unit</b> pada jadwal ini.</span>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 font-semibold text-sm">Tutup</button>
              {step === 1 ? (
                <button disabled={!ready || slotFull} onClick={() => { if (slotFull) { pushToast('Stok habis di jam tersebut — pilih jam lain', 'error'); return } setStep(2) }} className="flex-1 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1.5">
                  Lanjut ringkasan <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button disabled={!ready || slotFull} onClick={() => { addCart(bike.id, paket, qty); onClose(); setCartOpen(true) }} className="flex-1 py-3 rounded-full bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-40 flex items-center justify-center gap-1.5">
                  Masuk keranjang <ShoppingBag className="w-4 h-4" />
                </button>
              )}
            </div>
            {step === 2 && (
              <button onClick={() => { addCart(bike.id, paket, qty); onClose(); nav('/pemesanan', { state: { tgl, jam } }) }} className="w-full py-2.5 text-sm underline font-bold">
                Lanjut isi formulir →
              </button>
            )}
            {!ready && <p className="text-xs text-amber-600 flex items-center gap-1 justify-center"><AlertCircle className="w-3 h-3" /> Sepeda sedang disewa — pilih sepeda lain.</p>}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export function FloatingWA() {
  return (
    <a href={waLink('Halo Gowes Point Langsa, saya ingin tanya sewa sepeda')} target="_blank" rel="noreferrer" aria-label="Hubungi via WhatsApp" className="hidden lg:flex fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl items-center justify-center hover:scale-105 transition">
      <MessageCircle className="w-7 h-7 fill-white" />
    </a>
  )
}
