import { useEffect, useState } from 'react'
import { ArrowRight, AlertCircle, Check, ShoppingBag } from 'lucide-react'
import { bikes, fmt, waLink, packageById, slotOf } from '../data'
import { useShop } from '../store'

export type BookingInit = { tgl?: string; jam?: string; paket?: string }

const LOKASI = 'Toko Pusat - Jl. A. Yani No.45, Langsa'

type DoneLine = { sepeda: string; qty: number; tgl: string; jam: string }

// Formulir penyewaan (dipakai page Pemesanan).
// Pilihan sepeda berasal dari RINGKASAN/keranjang — tidak ada dropdown sepeda di sini.
export default function BookingForm({ init }: { init?: BookingInit }) {
  const { pushToast, addBooking, unitsFree, cart, setCart } = useShop()
  const [form, setForm] = useState({ nama: '', wa: '', email: '', tgl: '', jam: '08:00', lokasi: LOKASI, catatan: '', setuju: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ nama: string; lines: DoneLine[] } | null>(null)

  // Prefill tanggal/jam dari keranjang/drawer (location.state)
  useEffect(() => {
    if (!init) return
    setForm(f => ({
      ...f,
      tgl: init.tgl || f.tgl,
      jam: init.jam || f.jam,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init?.tgl, init?.jam])

  // Ketersediaan per baris keranjang pada jadwal form
  const lines = cart.map(c => {
    const b = bikes.find(x => x.id === c.id)
    const slot = slotOf(form.jam, c.paket)
    const free = form.tgl ? unitsFree(c.id, form.tgl, slot.start, slot.end).length : null
    return { line: c, bike: b, free }
  })
  const blocked = lines.filter(l => l.free === 0)
  const cartTotal = cart.reduce((s, c) => s + packageById(c.paket).price * c.qty, 0)

  const validate = () => {
    const e: Record<string, string> = {}
    if (cart.length === 0) e.cart = 'Keranjang masih kosong — pilih sepeda dulu di atas.'
    if (!form.nama.trim() || form.nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter'
    if (!/^08[0-9]{8,11}$/.test(form.wa.replace(/\s|-/g, ''))) e.wa = 'Nomor WhatsApp tidak valid (contoh: 081234567890)'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (!form.tgl) e.tgl = 'Pilih tanggal'
    if (!form.setuju) e.setuju = 'Anda harus menyetujui syarat & ketentuan'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) { pushToast('Periksa kembali formulir Anda', 'error'); return }
    const habis = lines.find(l => l.free === 0)
    if (habis) {
      setErrors(err => ({ ...err, slot: `Stok ${habis.bike?.nama ?? 'sepeda'} habis pada ${form.tgl} pukul ${form.jam}. Kurangi jumlah atau pilih jadwal lain.` }))
      pushToast('Ada sepeda yang stoknya habis di jam tersebut', 'error')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      const made: DoneLine[] = []
      for (const l of lines) {
        const paket = packageById(l.line.paket)
        addBooking({
          nama: form.nama, wa: form.wa, email: form.email,
          sepedaId: l.line.id, sepedaNama: l.bike ? l.bike.nama : l.line.id,
          paketId: paket.id, paketLabel: paket.sub ? `${paket.label} (${paket.sub})` : paket.label,
          total: paket.price * l.line.qty, tgl: form.tgl, jam: form.jam,
          lokasi: form.lokasi, catatan: form.catatan, qty: l.line.qty,
        })
        made.push({ sepeda: l.bike ? l.bike.nama : l.line.id, qty: l.line.qty, tgl: form.tgl, jam: form.jam })
      }
      setCart([])
      setDone({ nama: form.nama, lines: made })
      pushToast('Pemesanan berhasil dibuat. Tim Gowes Point Langsa akan menghubungi Anda melalui WhatsApp.')
      setForm({ nama: '', wa: '', email: '', tgl: '', jam: '08:00', lokasi: LOKASI, catatan: '', setuju: false })
    }, 900)
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 grid place-items-center mx-auto"><Check className="w-8 h-8 text-emerald-600" /></div>
        <h3 className="font-extrabold text-xl mt-4">Pemesanan berhasil!</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          Terima kasih <b>{done.nama}</b>. {done.lines.length} jenis pesanan sudah kami terima.
          Tim Gowes Point Langsa akan menghubungi Anda melalui WhatsApp.
        </p>
        <ul className="mt-4 space-y-2 max-w-[420px] mx-auto text-left">
          {done.lines.map((l, i) => (
            <li key={i} className="text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 flex justify-between gap-2">
              <span><b>{l.sepeda} × {l.qty}</b> • {l.tgl} pukul {l.jam}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <button onClick={() => setDone(null)} className="px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 font-bold text-sm">Buat pesanan lagi</button>
          <a href={waLink(`Halo Gowes Point Langsa, saya ${done.nama}, menanyakan pesanan saya tanggal ${done.lines[0]?.tgl}`)} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-sm">Konfirmasi via WA</a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* ringkasan isi keranjang + ketersediaan slot */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 space-y-2">
        <div className="text-xs font-bold tracking-wide text-zinc-500 flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5" /> ISI KERANJANG</div>
        {lines.length === 0 && <p className="text-sm text-zinc-500">Keranjang kosong — tambah sepeda dari daftar di atas.</p>}
        {lines.map(l => (
          <div key={l.line.id + l.line.paket} className="flex items-center gap-2 text-sm">
            <span className="flex-1 min-w-0 truncate"><b>{l.bike?.nama}</b> × {l.line.qty} <span className="text-zinc-500">({packageById(l.line.paket).label})</span></span>
            {l.free === null
              ? <span className="text-xs text-zinc-400">pilih tanggal</span>
              : l.free === 0
                ? <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">Habis di jam ini</span>
                : <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Sisa {l.free}</span>}
          </div>
        ))}
        {lines.length > 0 && (
          <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700 text-sm">
            <span className="text-zinc-500">Estimasi total</span>
            <span className="font-extrabold text-lg text-emerald-600">{fmt(cartTotal)}</span>
          </div>
        )}
        {errors.cart && <p className="text-xs text-red-500">{errors.cart}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Nama lengkap <span className="text-red-500">*</span></span>
          <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Cut Aulia" className={`w-full px-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.nama ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`} aria-invalid={!!errors.nama} />
          {errors.nama && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.nama}</span>}
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Nomor WhatsApp <span className="text-red-500">*</span></span>
          <input value={form.wa} onChange={e => setForm({ ...form, wa: e.target.value })} placeholder="0812xxxxxxx" inputMode="tel" className={`w-full px-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.wa ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`} />
          {errors.wa && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.wa}</span>}
        </label>
      </div>
      <label className="space-y-1.5 text-sm block">
        <span className="font-medium">Email (opsional)</span>
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="nama@email.com" type="email" className={`w-full px-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`} />
        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
      </label>
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Tanggal sewa <span className="text-red-500">*</span></span>
          <input type="date" value={form.tgl} onChange={e => setForm({ ...form, tgl: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-sm ${errors.tgl ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`} />
          {errors.tgl && <span className="text-xs text-red-500">{errors.tgl}</span>}
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Jam mulai</span>
          <input type="time" value={form.jam} onChange={e => setForm({ ...form, jam: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Lokasi pengambilan <span className="text-red-500">*</span></span>
          <select value={form.lokasi} onChange={e => setForm({ ...form, lokasi: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm">
            <option>Toko Pusat - Jl. A. Yani No.45, Langsa</option>
            <option>Taman Kota Langsa</option>
            <option>Alun-Alun Langsa</option>
          </select>
        </label>
      </div>
      <label className="space-y-1.5 text-sm block">
        <span className="font-medium">Catatan tambahan</span>
        <textarea value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} rows={3} placeholder="Contoh: butuh helm 2 buah, jam 07.00 sudah siap..." className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm resize-none" />
      </label>
      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" checked={form.setuju} onChange={e => setForm({ ...form, setuju: e.target.checked })} className="mt-1 w-4 h-4 rounded accent-emerald-600" />
        <span>Saya menyetujui <a href="#" className="underline font-medium">syarat dan ketentuan</a> serta <a href="#" className="underline font-medium">kebijakan privasi</a> Gowes Point Langsa. <span className="text-red-500">*</span></span>
      </label>
      {errors.setuju && <p className="text-xs text-red-500 -mt-2">{errors.setuju}</p>}
      {blocked.length > 0 && (
        <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
          <span className="text-rose-700 dark:text-rose-200"><b>Stok habis di jam ini</b> — {blocked.map(l => l.bike?.nama).join(', ')} penuh pada {form.tgl} pukul {form.jam}. Kurangi jumlah atau ubah jadwal.</span>
        </div>
      )}
      {errors.slot && <p className="text-xs text-red-500">{errors.slot}</p>}
      <button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-md disabled:opacity-60 transition flex items-center justify-center gap-2">
        {submitting ? 'Memproses...' : `Kirim ${cart.length} Pesanan`} {!submitting && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  )
}
