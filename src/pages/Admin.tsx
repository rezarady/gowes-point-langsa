import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Trash2, LogOut, Phone, Calendar, Bike as BikeIcon, Wallet, ClipboardList, BellRing, FileSpreadsheet, FileText, Boxes } from 'lucide-react'
import { fmt, bikes, initialUnits, HOURS, fmtJam, slotOf, overlap, type UnitStatus } from '../data'
import { useShop, type BookingStatus } from '../store'

const STATUS: { id: BookingStatus | 'semua'; label: string }[] = [
  { id: 'semua', label: 'Semua' },
  { id: 'baru', label: 'Baru' },
  { id: 'dikonfirmasi', label: 'Dikonfirmasi' },
  { id: 'selesai', label: 'Selesai' },
  { id: 'batal', label: 'Batal' },
]

const pill: Record<BookingStatus, string> = {
  baru: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  dikonfirmasi: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  selesai: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  batal: 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
}

// Dashboard admin: pantau pemesanan (data localStorage per perangkat)
export default function Admin() {
  const { isAdmin, logout, bookings, setBookingStatus, deleteBooking, pushToast, unitStatus, setUnitStatus, availOf, confirmBooking } = useShop()
  const cycleUnit = (uid: string) => {
    const cur = unitStatus[uid] ?? 'tersedia'
    const next: UnitStatus = cur === 'tersedia' ? 'disewa' : cur === 'disewa' ? 'servis' : 'tersedia'
    setUnitStatus(uid, next)
  }
  const unitPill: Record<UnitStatus, string> = {
    tersedia: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    disewa: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    servis: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  }
  const nav = useNavigate()
  const [filter, setFilter] = useState<BookingStatus | 'semua'>('semua')
  const [q, setQ] = useState('')
  const [jadwalTgl, setJadwalTgl] = useState(() => new Date().toISOString().slice(0, 10))

  if (!isAdmin) {
    return (
      <div className="max-w-[480px] mx-auto px-4 py-16 text-center">
        <p className="font-bold">Halaman ini khusus admin.</p>
        <button onClick={() => nav('/admin/login')} className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold text-sm">Login dulu</button>
      </div>
    )
  }

  const baru = bookings.filter(b => b.status === 'baru').length
  const omzet = bookings.filter(b => b.status !== 'batal').reduce((s, b) => s + b.total, 0)
  const list = useMemo(() => bookings.filter(b => {
    if (filter !== 'semua' && b.status !== filter) return false
    if (q && !(`${b.nama} ${b.sepedaNama} ${b.id}`.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  }), [bookings, filter, q])

  const stamp = new Date().toISOString().slice(0, 10)

  const exportCSV = () => {
    if (list.length === 0) { pushToast('Tidak ada data untuk diekspor', 'error'); return }
    const head = ['ID', 'Nama', 'WhatsApp', 'Sepeda', 'Qty', 'Unit', 'Paket', 'Tanggal', 'Jam', 'Lokasi', 'Total (Rp)', 'Status']
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
    const rows = list.map(b => [b.id, b.nama, b.wa, b.sepedaNama, b.qty, b.unitIds.join(' '), b.paketLabel, b.tgl, b.jam, b.lokasi, b.total, b.status].map(esc).join(';'))
    const blob = new Blob(['\uFEFF' + head.join(';') + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `gowes-pemesanan-${stamp}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
    pushToast(`${list.length} pesanan diekspor ke Excel (CSV)`)
  }

  const exportPDF = () => {
    if (list.length === 0) { pushToast('Tidak ada data untuk diekspor', 'error'); return }
    const w = window.open('', '_blank', 'width=900,height=700')
    if (!w) { pushToast('Popup diblokir browser', 'error'); return }
    const rows = list.map((b, i) => `<tr><td>${i + 1}</td><td>${b.id}</td><td>${b.nama}<br><small>${b.wa}</small></td><td>${b.sepedaNama}<br><small>${b.paketLabel}</small></td><td>${b.tgl} ${b.jam}</td><td style="text-align:right">${fmt(b.total)}</td><td>${b.status}</td></tr>`).join('')
    w.document.write(`<html><head><title>Pesanan Gowes Point Langsa ${stamp}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{font-size:20px}p{font-size:12px;color:#555}table{width:100%;border-collapse:collapse;font-size:12px;margin-top:12px}th,td{border:1px solid #999;padding:6px;text-align:left;vertical-align:top}th{background:#eee}</style></head><body><h1>Gowes Point Langsa — Daftar Pemesanan</h1><p>Dicetak ${new Date().toLocaleString('id-ID')} • ${list.length} pesanan</p><table><tr><th>No</th><th>ID</th><th>Pemesan</th><th>Sepeda</th><th>Jadwal</th><th>Total</th><th>Status</th></tr>${rows}</table></body></html>`)
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[Fraunces] text-[28px] sm:text-[34px] font-extrabold tracking-tight">Dashboard Admin</h1>
          <p className="text-sm text-zinc-500 mt-1">Pantau pemesanan masuk, konfirmasi, dan selesaikan.</p>
        </div>
        <button onClick={() => { logout(); pushToast('Logout berhasil'); nav('/') }} className="inline-flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {/* statistik */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="rounded-[20px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 shadow-sm">
          <div className="text-xs text-zinc-500 flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5" /> Total pesanan</div>
          <div className="font-extrabold text-2xl mt-1">{bookings.length}</div>
        </div>
        <div className="rounded-[20px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 shadow-sm">
          <div className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1"><BellRing className="w-3.5 h-3.5" /> Perlu respons</div>
          <div className="font-extrabold text-2xl mt-1">{baru}</div>
        </div>
        <div className="rounded-[20px] bg-emerald-600 text-white p-4 shadow-sm">
          <div className="text-xs text-emerald-100 flex items-center gap-1"><Wallet className="w-3.5 h-3.5" /> Estimasi omzet</div>
          <div className="font-extrabold text-xl sm:text-2xl mt-1">{fmt(omzet)}</div>
        </div>
      </div>

      {/* filter + cari */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari nama, sepeda, atau ID pesanan..." className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS.map(s => (
            <button key={s.id} onClick={() => setFilter(s.id)} className={`px-3.5 py-2 rounded-full text-sm font-bold border ${filter === s.id ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* daftar pesanan */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={exportCSV} className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-extrabold">
          <FileSpreadsheet className="w-4 h-4" /> Export Excel
        </button>
        <button onClick={exportPDF} className="inline-flex items-center gap-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-full text-xs font-extrabold">
          <FileText className="w-4 h-4" /> Export PDF
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {list.length === 0 && (
          <div className="text-center py-14 bg-white dark:bg-zinc-800 rounded-[24px] border border-dashed border-zinc-300 dark:border-zinc-700">
            <p className="font-extrabold">Belum ada pesanan</p>
            <p className="text-sm text-zinc-500 mt-1">Pesanan dari formulir akan muncul di sini.</p>
          </div>
        )}
        {list.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[20px] p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-full font-bold">{b.id}</span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${pill[b.status]}`}>{b.status.toUpperCase()}</span>
              <span className="ml-auto text-xs text-zinc-500">{new Date(b.dibuat).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 mt-3 text-sm">
              <div className="flex items-center gap-2"><BikeIcon className="w-4 h-4 text-zinc-400 shrink-0" /><span><b>{b.sepedaNama}</b><br /><span className="text-xs text-zinc-500">{b.paketLabel}</span></span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-zinc-400 shrink-0" /><span>{b.tgl} • {b.jam}<br /><span className="text-xs text-zinc-500">{b.lokasi}</span></span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-zinc-400 shrink-0" /><span><b>{b.nama}</b><br /><a href={`https://wa.me/62${b.wa.replace(/^0/, '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 underline font-bold">{b.wa}</a></span></div>
            </div>
            {b.catatan && <p className="text-xs text-zinc-500 mt-2 italic">“{b.catatan}”</p>}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700">
              <span className="font-extrabold text-emerald-600">{fmt(b.total)}</span>
              {b.unitIds.length > 0 && <span className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-full">Unit: {b.unitIds.join(', ')}</span>}
              <span className="text-xs text-zinc-500">× {b.qty} unit</span>
              <span className="flex-1" />
              {b.status === 'baru' && (
                <button onClick={() => { const err = confirmBooking(b.id); if (err) pushToast(err, 'error'); else pushToast(`Pesanan ${b.id} dikonfirmasi — unit otomatis dikunci`) }} className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700">Konfirmasi</button>
              )}
              {b.status === 'dikonfirmasi' && (
                <button onClick={() => { setBookingStatus(b.id, 'selesai'); pushToast(`Pesanan ${b.id} selesai`) }} className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700">Selesaikan</button>
              )}
              {b.status !== 'batal' && b.status !== 'selesai' && (
                <button onClick={() => { setBookingStatus(b.id, 'batal'); pushToast(`Pesanan ${b.id} dibatalkan`, 'error') }} className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-bold">Batalkan</button>
              )}
              <button onClick={() => { deleteBooking(b.id); pushToast('Pesanan dihapus', 'error') }} aria-label="Hapus pesanan" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center hover:bg-rose-50"><Trash2 className="w-4 h-4 text-rose-500" /></button>
            </div>
          </motion.div>
        ))}
      </div>
      {/* jadwal stok per jam */}
      <h2 className="font-[Fraunces] text-[22px] font-extrabold tracking-tight mt-10 flex items-center gap-2"><Calendar className="w-5 h-5" /> Jadwal Stok per Jam</h2>
      <p className="text-sm text-zinc-500 mt-1">Sisa unit bebas per jam operasional — sel merah berarti penuh.</p>
      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[20px] p-4 shadow-sm mt-4">
        <label className="inline-flex items-center gap-2 text-sm font-bold mb-1">
          Tanggal
          <input type="date" value={jadwalTgl} onChange={e => setJadwalTgl(e.target.value)} className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm" />
        </label>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-500 mb-3">
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Bebas</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Disewa (booking)</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Servis / nonaktif</span>
        </div>
        <div className="space-y-5">
          {bikes.map(t => (
            <div key={t.id}>
              <div className="text-sm font-extrabold mb-2">{t.nama} <span className="text-xs font-medium text-zinc-500">({initialUnits.filter(u => u.typeId === t.id).length} unit)</span></div>
              <div className="overflow-x-auto">
                <table className="text-xs min-w-[640px]">
                  <thead>
                    <tr className="text-zinc-500">
                      <th className="py-1.5 pr-2 text-left font-bold sticky left-0">ID</th>
                      {HOURS.map(h => <th key={h} className="py-1.5 px-1 font-mono font-bold whitespace-nowrap">{fmtJam(h * 60)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {initialUnits.filter(u => u.typeId === t.id).map(u => (
                      <tr key={u.uid} className="border-t border-zinc-100 dark:border-zinc-700">
                        <td className="py-1.5 pr-2 font-mono font-bold whitespace-nowrap sticky left-0">{u.uid}</td>
                        {HOURS.map(h => {
                          const manual = unitStatus[u.uid] ?? 'tersedia'
                          const booked = manual === 'tersedia' && bookings.some(b =>
                            (b.status === 'dikonfirmasi' || b.status === 'selesai') &&
                            b.tgl === jadwalTgl && b.sepedaId === t.id && b.unitIds.includes(u.uid) &&
                            overlap({ start: h * 60, end: (h + 1) * 60 }, slotOf(b.jam, b.paketId)))
                          const cls = manual !== 'tersedia' ? 'bg-rose-500' : booked ? 'bg-amber-500' : 'bg-emerald-500'
                          const title = `${u.uid} • ${fmtJam(h * 60)} — ${manual !== 'tersedia' ? manual : booked ? 'disewa (booking)' : 'bebas'}`
                          return <td key={h} className="py-1.5 px-1 text-center" title={title}><span className={`inline-block w-3.5 h-3.5 rounded-full ${cls}`} /></td>
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* database stok per unit */}
      <h2 className="font-[Fraunces] text-[22px] font-extrabold tracking-tight mt-10 flex items-center gap-2"><Boxes className="w-5 h-5" /> Database Stok — {initialUnits.length} unit</h2>
      <p className="text-sm text-zinc-500 mt-1">Tap unit untuk ganti status: tersedia → disewa → servis. Stok katalog ikut berubah otomatis.</p>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {bikes.map(t => {
          const units = initialUnits.filter(u => u.typeId === t.id)
          const av = availOf(t.id)
          return (
            <div key={t.id} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[20px] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="font-extrabold text-sm">{t.nama}</div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${av > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700'}`}>{av}/{units.length} tersedia</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {units.map(u => {
                  const st = unitStatus[u.uid] ?? 'tersedia'
                  return (
                    <button key={u.uid} onClick={() => cycleUnit(u.uid)} title={`${u.label} — ${st} (tap untuk ubah)`} className={`font-mono text-[11px] font-bold px-2.5 py-1.5 rounded-full border transition hover:scale-105 ${unitPill[st]} border-transparent`}>
                      {u.uid}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-zinc-400 mt-6 text-center">Data tersimpan di perangkat ini (localStorage). Untuk multi-perangkat butuh backend/API.</p>
    </div>
  )
}
