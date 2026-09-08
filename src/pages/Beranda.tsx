import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  ShieldCheck, Wallet, Search, MapPin, Clock, Star, ChevronDown, ChevronLeft, ChevronRight,
  ArrowRight, Sparkles, Navigation, Heart, Zap, Calendar, Users, Bike,
  ShoppingBag, Heart as HeartIcon, Eye, Filter, ArrowUpRight, Phone,
} from 'lucide-react'
import { bikes, stokOf, ruteList, testi, faqs, fmt, waLink, WA_DISPLAY, type BikeType, type BikeItem } from '../data'
import { useShop } from '../store'
import { BikeDrawer, useGoSection } from '../components/chrome'

export default function Beranda() {
  const reduce = useReducedMotion()
  const loc = useLocation()
  const go = useGoSection()
  const { wish, toggleWish, addCart, live } = useShop()

  // scroll dari navigasi antar-page
  useEffect(() => {
    const target = (loc.state as { scroll?: string } | null)?.scroll
    if (target) {
      const t = setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
      window.history.replaceState({}, '')
      return () => clearTimeout(t)
    }
  }, [loc.state])

  // katalog
  const [q, setQ] = useState('')
  const [jenisFilter, setJenisFilter] = useState<BikeType | 'Semua'>('Semua')
  const [availFilter, setAvailFilter] = useState<'Semua' | 'Tersedia'>('Semua')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [sort, setSort] = useState<'termurah' | 'termahal'>('termurah')
  const [showFilters, setShowFilters] = useState(false)
  const [activeBike, setActiveBike] = useState<BikeItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [boot, setBoot] = useState(true)
  useEffect(() => { const t = setTimeout(() => setBoot(false), 700); return () => clearTimeout(t) }, [])

  // testimoni + faq
  const [tIdx, setTIdx] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  useEffect(() => {
    const id = setInterval(() => setTIdx(i => (i + 1) % testi.length), 4000)
    return () => clearInterval(id)
  }, [])

  const filtered = useMemo(() => {
    let r = bikes.filter(b => {
      if (q && !(`${b.nama} ${b.jenis}`.toLowerCase().includes(q.toLowerCase()))) return false
      if (jenisFilter !== 'Semua' && b.jenis !== jenisFilter) return false
      if (availFilter === 'Tersedia' && b.status !== 'Tersedia') return false
      if (b.hargaJam < priceRange[0] || b.hargaJam > priceRange[1]) return false
      return true
    })
    r = [...r].sort((a, b) => sort === 'termurah' ? a.hargaJam - b.hargaJam : b.hargaJam - a.hargaJam)
    return r
  }, [q, jenisFilter, availFilter, priceRange, sort])

  const openDetail = (b: BikeItem) => { setActiveBike(b); setDrawerOpen(true) }
  void live

  return (
    <>
      {/* TODAY */}
      <section id="beranda" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-4">
          <motion.div initial={reduce ? {} : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-[28px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6 sm:p-7 shadow-sm relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-100 dark:bg-emerald-950 rounded-full blur-2xl opacity-60" />
            <div className="relative">
              <div className="inline-flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2.5 py-1 rounded-full">HARI INI DI LANGSA</span>
                <span className="inline-flex items-center gap-1.5 text-zinc-500"><Clock className="w-3.5 h-3.5" /> Buka 06.00–18.00</span>
              </div>
              <h1 className="font-[Fraunces] text-[32px] sm:text-[40px] font-extrabold leading-[0.95] tracking-tight mt-3">
                Siap gowes?<br />
                <span className="text-emerald-600">Pilih sepeda, atur jam,</span><br />
                langsung jalan.
              </h1>
              <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400 mt-3 max-w-[560px]">
                Telusuri katalog, filter live, cek stok real, masuk keranjang dan checkout di page Pemesanan dalam 2 menit.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <button onClick={() => go('daftar-sepeda')} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-full shadow transition text-sm">Buka katalog <ArrowRight className="w-4 h-4" /></button>
                <button onClick={() => go('cara-sewa')} className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold px-5 py-3 rounded-full text-sm">Cara kerja</button>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-3 py-2 rounded-full"><Sparkles className="w-3.5 h-3.5" /> Mulai Rp15.000/jam</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 text-xs"><span className="text-zinc-500">Stok live</span> <span className="font-bold">{bikes.filter(b => b.status === 'Tersedia').length} unit</span></span>
                <span className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 text-xs"><span className="text-zinc-500">Respon WA</span> <span className="font-bold">&lt; 3 menit</span></span>
                <span className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 text-xs"><span className="text-zinc-500">Rating</span> <span className="font-bold">4.9/5</span></span>
              </div>
            </div>
          </motion.div>

          <motion.button onClick={() => openDetail(bikes[0])} initial={reduce ? {} : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="rounded-[28px] overflow-hidden bg-zinc-900 dark:bg-black text-white p-4 text-left shadow-sm hover:shadow-lg transition group">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full font-bold"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE STAGE</span>
              <span className="text-white/60">Tap untuk detail</span>
            </div>
            <div className="mt-3 rounded-[20px] overflow-hidden bg-white text-zinc-900">
              <div className="relative h-[210px] overflow-hidden">
                <img src={bikes[0].gambar} alt={bikes[0].nama} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" loading="eager" />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">Gunung • Stok {stokOf(bikes[0])} unit</span>
              </div>
              <div className="p-4">
                <div className="font-extrabold leading-none">{bikes[0].nama}</div>
                <div className="text-xs text-zinc-500 mt-1">MTB 21 speed — andalan untuk semua rute.</div>
                <div className="flex items-end justify-between mt-3">
                  <div className="font-extrabold text-emerald-600 text-lg">{fmt(bikes[0].hargaJam)}<span className="text-zinc-500 font-medium text-xs">/jam</span></div>
                  <span className="inline-flex items-center gap-1 text-sm font-bold">Lihat <ArrowUpRight className="w-4 h-4" /></span>
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      </section>

      {/* KEUNGGULAN bento */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid md:grid-cols-12 gap-4">
          <motion.div initial={reduce ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-8 bg-white dark:bg-zinc-800 rounded-[24px] p-6 border border-zinc-100 dark:border-zinc-700 shadow-sm flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white grid place-items-center shrink-0"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-extrabold">Sepeda terawat — cek harian, helm dan kunci termasuk</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">Ban, rem, rantai, dan lampu dicek tiap pagi sebelum keluar. Tidak pakem, tidak disewakan.</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <span className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-200 px-2.5 py-1 rounded-full font-bold">Servis rutin</span>
                <span className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-full">Cuci harian</span>
                <span className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-full">Helm gratis</span>
              </div>
            </div>
          </motion.div>
          <motion.div initial={reduce ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="md:col-span-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[24px] p-6 flex flex-col justify-between shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-zinc-900/10 grid place-items-center"><Zap className="w-5 h-5" /></div>
            <div className="mt-4">
              <div className="font-extrabold text-[18px] leading-tight">Booking 2 menit.<br />Tanpa telepon.</div>
              <p className="text-sm opacity-70 mt-1">Pilih, atur waktu, keranjang, WA. Beres.</p>
            </div>
            <button onClick={() => go('daftar-sepeda')} className="mt-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-full py-2.5 font-extrabold text-sm">Coba sekarang →</button>
          </motion.div>
          <motion.div initial={reduce ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }} className="md:col-span-4 rounded-[24px] bg-[#ffcf4d] border border-amber-200 p-6 flex flex-col text-zinc-900">
            <Wallet className="w-7 h-7" />
            <div className="font-extrabold mt-3">Harga jujur</div>
            <div className="text-sm opacity-70">Mulai 15rb/jam. Harian lebih hemat. Hitung live di aplikasi.</div>
            <div className="mt-auto pt-4 font-extrabold text-2xl">Rp15.000<span className="text-sm font-medium opacity-60">/jam</span></div>
          </motion.div>
          <motion.div initial={reduce ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.16 }} className="md:col-span-8 bg-white dark:bg-zinc-800 rounded-[24px] p-6 border border-zinc-100 dark:border-zinc-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white grid place-items-center shrink-0"><Heart className="w-6 h-6" /></div>
            <div className="flex-1">
              <div className="font-extrabold">Tim lokal Langsa — standby WhatsApp</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Rute bingung? Ban kempes? Chat saja, kami bantu. Bisa antar-jemput.</div>
            </div>
            <a href={waLink('Halo Gowes Point Langsa, saya ingin tanya sewa sepeda')} target="_blank" rel="noreferrer" className="hidden sm:inline-flex bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full px-4 py-2 text-sm font-extrabold shrink-0">Chat WA</a>
          </motion.div>
        </div>
      </section>

      {/* KATALOG */}
      <section id="daftar-sepeda" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-[Fraunces] text-[28px] sm:text-[32px] font-extrabold tracking-tight inline-flex items-center gap-2">Katalog <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs px-2.5 py-1 rounded-full font-extrabold tracking-wide">EXPLORE</span></h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Jelajahi, filter, wishlist, masuk keranjang.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-[20px] border border-zinc-100 dark:border-zinc-700 p-3 flex flex-col lg:flex-row gap-3 shadow-sm sticky top-[64px] z-20">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari: Gunung, Lipat, Keranjang..." className="w-full pl-10 pr-4 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Cari sepeda" />
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {(['Semua', 'Gunung', 'Lipat', 'Keranjang', 'Upin-Ipin'] as const).map(j => (
              <button key={j} onClick={() => setJenisFilter(j as typeof jenisFilter)} className={`px-3.5 py-2 rounded-full text-sm font-bold border transition ${jenisFilter === j ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'}`}>{j}</button>
            ))}
            <span className="hidden sm:block h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />
            <select value={availFilter} onChange={e => setAvailFilter(e.target.value as typeof availFilter)} className="px-3 py-2 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-medium">
              <option value="Semua">Semua</option><option value="Tersedia">Hanya tersedia</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} className="px-3 py-2 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-medium">
              <option value="termurah">Termurah</option><option value="termahal">Termahal</option>
            </select>
          </div>
        </div>

        <div className="mt-3">
          <button onClick={() => setShowFilters(v => !v)} className="inline-flex items-center gap-1.5 text-xs font-bold underline">Filter harga {showFilters ? '▲' : '▼'}</button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-[20px] p-4 grid sm:grid-cols-3 gap-4 shadow-sm">
                <div className="sm:col-span-2">
                  <div className="text-xs font-bold tracking-wide text-zinc-500">MAKS HARGA / JAM: {fmt(priceRange[1])}</div>
                  <input type="range" min={15000} max={50000} step={5000} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full accent-emerald-600 mt-2" />
                  <div className="flex justify-between text-xs text-zinc-500"><span>Rp15k</span><span>Rp50k</span></div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-3 border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs font-bold text-zinc-500">RINGKASAN</div>
                  <div className="text-sm mt-1"><span className="font-bold">{filtered.length}</span> hasil</div>
                  <button onClick={() => { setQ(''); setJenisFilter('Semua'); setAvailFilter('Semua'); setPriceRange([0, 50000]) }} className="mt-2 text-xs font-bold underline">Reset semua</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-3 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-full font-bold"><Filter className="w-3 h-3" /> {filtered.length} hasil</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> live</span>
        </div>

        {boot ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-800 rounded-[24px] border border-zinc-100 dark:border-zinc-700 overflow-hidden p-3 animate-pulse">
                <div className="h-[190px] bg-zinc-100 dark:bg-zinc-700 rounded-[16px]" />
                <div className="h-4 bg-zinc-100 dark:bg-zinc-700 rounded mt-3 w-3/4" />
                <div className="h-3 bg-zinc-100 dark:bg-zinc-700 rounded mt-2 w-1/2" />
                <div className="h-9 bg-zinc-100 dark:bg-zinc-700 rounded-full mt-4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-800 rounded-[24px] border border-dashed border-zinc-300 dark:border-zinc-600">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-700 grid place-items-center mx-auto"><Search className="w-6 h-6 text-zinc-400" /></div>
            <h3 className="font-extrabold mt-3">Tidak ada yang cocok</h3>
            <p className="text-sm text-zinc-500 mt-1">Coba longgarkan filter atau kata kunci.</p>
            <button onClick={() => { setQ(''); setJenisFilter('Semua'); setPriceRange([0, 50000]) }} className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-extrabold">Reset</button>
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((b, idx) => (
              <motion.div key={b.id} layout initial={reduce ? {} : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.04 }} whileHover={{ y: -4 }} className={`group bg-white dark:bg-zinc-800 rounded-[24px] overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-sm hover:shadow-lg transition flex flex-col ${b.status !== 'Tersedia' ? 'opacity-60' : ''}`}>
                <div className="relative h-[190px] overflow-hidden">
                  <img src={b.gambar} alt={b.nama} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                  <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${b.status === 'Tersedia' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{b.status} • {stokOf(b)} unit</span>
                  <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-zinc-700">{b.jenis}</span>
                  <button onClick={() => toggleWish(b.id)} aria-label="Wishlist" className={`absolute bottom-3 right-3 w-8 h-8 rounded-full grid place-items-center shadow border ${wish.has(b.id) ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/90 backdrop-blur border-zinc-200 text-zinc-700'}`}>
                    <HeartIcon className={`w-4 h-4 ${wish.has(b.id) ? 'fill-white' : ''}`} />
                  </button>
                  <span className="absolute bottom-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-900/80 text-white flex items-center gap-1"><Users className="w-3 h-3" /> {b.kapasitas.split('•')[0].trim()}</span>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-700"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${(stokOf(b) / 6) * 100}%` }} /></div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold leading-tight text-[15px]">{b.nama}</h3>
                    <span className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-full shrink-0">{b.id}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{b.kapasitas}</p>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="font-extrabold text-emerald-600">{fmt(b.hargaJam)}<span className="text-zinc-500 font-medium text-xs">/jam</span></span>
                    <span className="text-xs text-zinc-400">{fmt(b.hargaHari)}/hari</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={() => openDetail(b)} className="py-2.5 rounded-full border border-zinc-200 dark:border-zinc-600 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition inline-flex items-center justify-center gap-1"><Eye className="w-4 h-4" /> Detail</button>
                    <button onClick={() => addCart(b.id)} disabled={b.status !== 'Tersedia'} className="py-2.5 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-1"><ShoppingBag className="w-4 h-4" /> Tambah</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* CARA */}
      <section id="cara-sewa" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-[28px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-[Fraunces] text-[26px] sm:text-[32px] font-extrabold tracking-tight">4 tap selesai</h2>
            <span className="text-xs bg-white/10 dark:bg-zinc-900/10 border border-white/15 dark:border-zinc-900/10 px-3 py-1.5 rounded-full font-bold">ALUR APLIKASI</span>
          </div>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { n: 1, t: 'Pilih & Tambah', d: 'Tap Tambah. Wishlist dulu juga bisa.', ico: Bike },
              { n: 2, t: 'Atur Waktu', d: 'Tanggal, jam, durasi — harga live.', ico: Calendar },
              { n: 3, t: 'Isi Data', d: 'Nama & WA di page Pemesanan.', ico: Users },
              { n: 4, t: 'Ambil & Gowes', d: 'Verifikasi KTP, helm siap, kayuh!', ico: Navigation },
            ].map(s => (
              <div key={s.n} className="bg-white/5 dark:bg-zinc-900/5 border border-white/10 dark:border-zinc-900/10 rounded-[20px] p-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white grid place-items-center"><s.ico className="w-5 h-5" /></div>
                <div className="text-xs font-bold mt-3 opacity-60">LANGKAH {s.n}</div>
                <div className="font-extrabold mt-1">{s.t}</div>
                <div className="text-sm opacity-70 mt-1 leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RUTE */}
      <section id="rute" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <h2 className="font-[Fraunces] text-[26px] sm:text-[30px] font-extrabold tracking-tight">Rute di Langsa</h2>
          <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-3 py-1.5 rounded-full font-bold">Data contoh — cek lapangan</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {ruteList.map((r, i) => (
            <motion.div key={r.nama} initial={reduce ? {} : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-[24px] p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 grid place-items-center"><MapPin className="w-5 h-5" /></div>
              <h3 className="font-extrabold mt-3">{r.nama}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{r.deskripsi}</p>
              <div className="flex flex-wrap gap-1.5 mt-3 text-xs">
                <span className="bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full font-bold">{r.jarak}</span>
                <span className="bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full font-bold">{r.waktu}</span>
                <span className={`px-2.5 py-1 rounded-full font-bold ${r.kesulitan === 'Mudah' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' : 'bg-amber-100 text-amber-700'}`}>{r.kesulitan}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTI */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-center shadow-sm">
          <img src={testi[tIdx].avatar} alt={testi[tIdx].nama} className="w-14 h-14 rounded-full object-cover" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start gap-1 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < testi[tIdx].rating ? 'fill-amber-400' : ''}`} />)}</div>
            <p className="text-sm mt-1 leading-relaxed">“{testi[tIdx].isi}” <span className="font-extrabold">— {testi[tIdx].nama}</span></p>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setTIdx(i => (i - 1 + testi.length) % testi.length)} aria-label="Sebelumnya" className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setTIdx(i => (i + 1) % testi.length)} aria-label="Berikutnya" className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex gap-1.5 justify-center mt-3">
          {testi.map((_, i) => <button key={i} aria-label={`Testimoni ${i + 1}`} onClick={() => setTIdx(i)} className={`h-1.5 rounded-full transition ${i === tIdx ? 'w-6 bg-emerald-600' : 'w-6 bg-zinc-200 dark:bg-zinc-700'}`} />)}
        </div>
      </section>

      {/* LOKASI info (tanpa form — form pindah ke page Pemesanan) */}
      <section id="lokasi" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-[24px] p-6 shadow-sm">
          <h3 className="font-extrabold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-600" /> Lokasi & Jam</h3>
          <div className="text-sm mt-3 space-y-2 text-zinc-600 dark:text-zinc-400">
            <div><b className="text-zinc-900 dark:text-white">Toko Pusat</b> — Jl. A. Yani No.45, Langsa Kota, Aceh 24416</div>
            <div className="flex gap-2"><Clock className="w-4 h-4 mt-0.5" /> Setiap hari 06.00–18.00 WIB</div>
            <div className="flex gap-2"><Phone className="w-4 h-4 mt-0.5" /> {WA_DISPLAY}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <a href="https://maps.google.com/?q=Langsa,Aceh" target="_blank" rel="noreferrer" className="py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 font-bold text-sm text-center hover:bg-zinc-50 dark:hover:bg-zinc-700">Buka Maps</a>
            <a href={waLink('Halo Gowes Point Langsa, saya ingin tanya sewa sepeda')} target="_blank" rel="noreferrer" className="py-2.5 rounded-full bg-emerald-600 text-white font-bold text-sm text-center">WhatsApp</a>
          </div>
        </div>
        <div className="bg-emerald-600 text-white rounded-[24px] p-6">
          <h3 className="font-extrabold text-lg">Tentang Gowes Point Langsa</h3>
          <p className="text-sm leading-relaxed mt-2 text-white/90">Usaha lokal 2022 — ajak warga & wisatawan gowes sehat, ramah lingkungan. Sepeda dicek harian, harga jujur.</p>
          <div className="flex gap-2 mt-3 text-xs font-bold"><span className="bg-white/15 px-3 py-1.5 rounded-full">320+ puas</span><span className="bg-white/15 px-3 py-1.5 rounded-full">8 armada</span></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
        <h2 className="font-[Fraunces] text-2xl font-extrabold text-center">Pertanyaan Umum</h2>
        <div className="mt-4 rounded-[24px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-700">
          {faqs.map((f, i) => (
            <div key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                <span className="font-bold text-sm">{f.q}</span>
                <span className={`w-8 h-8 rounded-full border grid place-items-center shrink-0 ${openFaq === i ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900' : 'border-zinc-200 dark:border-zinc-600'}`}><ChevronDown className={`w-4 h-4 transition ${openFaq === i ? 'rotate-180' : ''}`} /></span>
              </button>
              <AnimatePresence>{openFaq === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm text-zinc-600 dark:text-zinc-400">{f.a}</p></motion.div>}</AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Drawer detail */}
      <AnimatePresence>
        {drawerOpen && activeBike && <BikeDrawer bike={activeBike} onClose={() => setDrawerOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
