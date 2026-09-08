import { useEffect, useState } from 'react'
import { ArrowRight, AlertCircle, Check } from 'lucide-react'
import { bikes, fmt, waLink } from '../data'
import { useShop } from '../store'

export type BookingInit = { sepeda?: string; tgl?: string; jam?: string; durasi?: string }

const LOKASI = 'Toko Pusat - Jl. A. Yani No.45, Langsa'

// Formulir penyewaan (dipakai page Pemesanan)
export default function BookingForm({ init }: { init?: BookingInit }) {
  const { pushToast } = useShop()
  const [form, setForm] = useState({ nama: '', wa: '', email: '', sepeda: '', tgl: '', jam: '08:00', durasi: '2', lokasi: LOKASI, catatan: '', setuju: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ nama: string; sepeda: string; tgl: string; jam: string } | null>(null)

  // Prefill dari keranjang/drawer (location.state)
  useEffect(() => {
    if (!init) return
    setForm(f => ({
      ...f,
      sepeda: init.sepeda || f.sepeda,
      tgl: init.tgl || f.tgl,
      jam: init.jam || f.jam,
      durasi: init.durasi || f.durasi,
    }))
  }, [init?.sepeda, init?.tgl, init?.jam, init?.durasi])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nama.trim() || form.nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter'
    if (!/^08[0-9]{8,11}$/.test(form.wa.replace(/\s|-/g, ''))) e.wa = 'Nomor WhatsApp tidak valid (contoh: 081234567890)'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (!form.sepeda) e.sepeda = 'Pilih sepeda'
    if (!form.tgl) e.tgl = 'Pilih tanggal'
    if (!form.setuju) e.setuju = 'Anda harus menyetujui syarat & ketentuan'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) { pushToast('Periksa kembali formulir Anda', 'error'); return }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      const b = bikes.find(x => x.id === form.sepeda)
      setDone({ nama: form.nama, sepeda: b ? b.nama : form.sepeda, tgl: form.tgl, jam: form.jam })
      pushToast('Pemesanan berhasil dibuat. Tim Gowes Point Langsa akan menghubungi Anda melalui WhatsApp.')
      setForm({ nama: '', wa: '', email: '', sepeda: '', tgl: '', jam: '08:00', durasi: '2', lokasi: LOKASI, catatan: '', setuju: false })
    }, 900)
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 grid place-items-center mx-auto"><Check className="w-8 h-8 text-emerald-600" /></div>
        <h3 className="font-extrabold text-xl mt-4">Pemesanan berhasil!</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          Terima kasih <b>{done.nama}</b>. Pesanan <b>{done.sepeda}</b> untuk <b>{done.tgl} pukul {done.jam}</b> sudah kami terima.
          Tim Gowes Point Langsa akan menghubungi Anda melalui WhatsApp.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <button onClick={() => setDone(null)} className="px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 font-bold text-sm">Buat pesanan lagi</button>
          <a href={waLink(`Halo Gowes Point Langsa, saya ${done.nama}, menanyakan pesanan ${done.sepeda} tanggal ${done.tgl}`)} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-sm">Konfirmasi via WA</a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Pilihan sepeda <span className="text-red-500">*</span></span>
          <select value={form.sepeda} onChange={e => setForm({ ...form, sepeda: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-sm ${errors.sepeda ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`}>
            <option value="">— Pilih sepeda —</option>
            {bikes.map(b => <option key={b.id} value={b.id} disabled={b.status !== 'Tersedia'}>{b.nama} — {fmt(b.hargaJam)}/jam {b.status !== 'Tersedia' ? '(Tidak tersedia)' : ''}</option>)}
          </select>
          {errors.sepeda && <span className="text-xs text-red-500">{errors.sepeda}</span>}
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Tanggal sewa <span className="text-red-500">*</span></span>
          <input type="date" value={form.tgl} onChange={e => setForm({ ...form, tgl: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-sm ${errors.tgl ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}`} />
          {errors.tgl && <span className="text-xs text-red-500">{errors.tgl}</span>}
        </label>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Jam mulai</span>
          <input type="time" value={form.jam} onChange={e => setForm({ ...form, jam: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Durasi (jam)</span>
          <select value={form.durasi} onChange={e => setForm({ ...form, durasi: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm">
            {[1, 2, 3, 4, 6, 8, 12, 24].map(h => <option key={h} value={String(h)}>{h} jam {h >= 24 ? '(1 hari)' : ''}</option>)}
          </select>
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
      <button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-md disabled:opacity-60 transition flex items-center justify-center gap-2">
        {submitting ? 'Memproses...' : 'Kirim Pemesanan'} {!submitting && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  )
}
