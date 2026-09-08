import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ArrowRight, ShieldCheck, Clock } from 'lucide-react'
import { bikes, fmt, stokOf, waLink } from '../data'
import { useShop } from '../store'
import BookingForm, { type BookingInit } from '../components/BookingForm'

export default function Pemesanan() {
  const { cart, setCart, cartTotal, cartCount, addCart } = useShop()
  const loc = useLocation()
  const nav = useNavigate()
  const init = (loc.state as BookingInit | null) || undefined

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-10">
      {/* header + stepper */}
      <button onClick={() => nav('/')} className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </button>
      <h1 className="font-[Fraunces] text-[30px] sm:text-[36px] font-extrabold tracking-tight mt-2">Pemesanan</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Cek keranjang, lengkapi data, tim kami konfirmasi via WhatsApp.</p>

      <div className="flex items-center gap-2 mt-5 max-w-[560px]">
        <span className="w-8 h-8 rounded-full grid place-items-center text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">1</span>
        <span className="text-sm font-bold">Keranjang</span>
        <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        <span className="w-8 h-8 rounded-full grid place-items-center text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">2</span>
        <span className="text-sm font-bold">Data & Kirim</span>
        <span className="flex-1 h-px bg-zinc-200 dark:border-zinc-700" />
        <span className="w-8 h-8 rounded-full grid place-items-center text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">3</span>
        <span className="text-sm font-bold text-zinc-500">Konfirmasi WA</span>
      </div>

      {/* Pilih sepeda langsung di sini */}
      <h2 className="font-[Fraunces] text-[22px] font-extrabold tracking-tight mt-8">Pilih Sepeda</h2>
      <p className="text-sm text-zinc-500 mt-1">Tap Tambah untuk masuk keranjang — atau isi formulir di bawah.</p>
      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        {bikes.map(b => {
          const inCart = cart.find(c => c.id === b.id)?.qty ?? 0
          return (
            <div key={b.id} className="flex gap-3 p-3 rounded-[20px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <img src={b.gambar} alt={b.nama} className="w-20 h-20 rounded-2xl object-cover shrink-0" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm truncate">{b.nama}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${b.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700'}`}>{stokOf(b)} unit</span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">{b.kapasitas}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-extrabold text-emerald-600 text-sm">{fmt(b.hargaJam)}<span className="text-zinc-500 font-medium text-xs">/jam</span></span>
                  {inCart > 0 ? (
                    <span className="text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-full">{inCart} di keranjang ✓</span>
                  ) : (
                    <button onClick={() => addCart(b.id)} disabled={b.status !== 'Tersedia'} className="text-xs font-extrabold bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700 disabled:opacity-40">Tambah</button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-4 mt-6 items-start">
        {/* ringkasan keranjang */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[24px] p-5 sm:p-6 shadow-sm">
          <h2 className="font-extrabold flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Ringkasan <span className="bg-zinc-100 dark:bg-zinc-900 text-xs px-2 py-1 rounded-full">{cartCount} unit</span></h2>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-bold">Keranjang masih kosong</p>
              <p className="text-sm text-zinc-500 mt-1">Pilih dulu sepedanya di katalog.</p>
              <button onClick={() => nav('/', { state: { scroll: 'daftar-sepeda' } })} className="mt-4 inline-flex items-center gap-1.5 bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm">Buka katalog <ArrowRight className="w-4 h-4" /></button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mt-4">
                {cart.map(c => {
                  const b = bikes.find(x => x.id === c.id)!; return (
                    <div key={c.id} className="flex gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                      <img src={b.gambar} alt={b.nama} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-extrabold truncate">{b.nama}</div>
                        <div className="text-xs text-zinc-500">{fmt(b.hargaJam)}/jam • {c.durasi} jam</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => setCart(v => v.map(x => x.id === c.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} aria-label="Kurangi" className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-extrabold w-8 text-center">{c.qty}</span>
                          <button onClick={() => setCart(v => v.map(x => x.id === c.id ? { ...x, qty: Math.min(6, x.qty + 1) } : x))} aria-label="Tambah" className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center"><Plus className="w-3 h-3" /></button>
                          <select value={c.durasi} onChange={e => setCart(v => v.map(x => x.id === c.id ? { ...x, durasi: Number(e.target.value) } : x))} aria-label="Durasi" className="ml-auto text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-2 py-1">
                            {[1, 2, 3, 4, 6, 8, 12, 24].map(h => <option key={h} value={h}>{h} jam</option>)}
                          </select>
                        </div>
                      </div>
                      <button onClick={() => setCart(v => v.filter(x => x.id !== c.id))} aria-label="Hapus" className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 grid place-items-center shrink-0"><Trash2 className="w-4 h-4 text-rose-500" /></button>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <span className="text-sm text-zinc-500">Estimasi total</span>
                <span className="font-extrabold text-xl text-emerald-600">{fmt(cartTotal)}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Total final dihitung ulang di formulir sesuai pilihan sepeda.</p>
            </>
          )}

          <div className="mt-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-sm space-y-2">
            <div className="font-extrabold flex items-center gap-2 text-emerald-800 dark:text-emerald-200"><ShieldCheck className="w-4 h-4" /> Syarat singkat</div>
            <ul className="text-emerald-900/80 dark:text-emerald-100/80 text-[13px] leading-relaxed list-disc pl-5">
              <li>Bawa KTP/SIM/Kartu Pelajar asli sebagai jaminan.</li>
              <li>Helm & kunci gembok sudah termasuk, gratis.</li>
              <li>Hujan lebat? Reschedule H+2 gratis atau refund 100%.</li>
            </ul>
          </div>
          <div className="mt-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4 text-sm flex items-center gap-3">
            <Clock className="w-5 h-5 text-zinc-400 shrink-0" />
            <div>Butuh bantuan? <a href={waLink('Halo Gowes Point Langsa, saya butuh bantuan pemesanan')} target="_blank" rel="noreferrer" className="font-bold underline">Chat WhatsApp</a> — respon &lt; 3 menit (06.00–18.00).</div>
          </div>
        </motion.div>

        {/* formulir */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[24px] p-5 sm:p-7 shadow-sm">
          <h2 className="font-[Fraunces] text-[22px] font-extrabold tracking-tight">Data Pemesan</h2>
          <p className="text-sm text-zinc-500 mt-1">Isi dengan benar — konfirmasi via WhatsApp.</p>
          <div className="mt-5">
            <BookingForm init={init} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
