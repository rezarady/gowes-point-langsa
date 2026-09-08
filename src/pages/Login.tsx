import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, ArrowLeft, AlertCircle } from 'lucide-react'
import { useShop } from '../store'

// Halaman login admin (sesi disimpan di localStorage)
export default function Login() {
  const { login, isAdmin, pushToast } = useShop()
  const nav = useNavigate()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  if (isAdmin) {
    return (
      <div className="max-w-[480px] mx-auto px-4 py-16 text-center">
        <p className="font-bold">Anda sudah login sebagai admin.</p>
        <button onClick={() => nav('/admin')} className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold text-sm">Buka dashboard</button>
      </div>
    )
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(user, pass)) {
      pushToast('Login admin berhasil')
      nav('/admin')
    } else {
      setErr('Username atau password salah')
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <button onClick={() => nav('/')} className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </button>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-[420px] mx-auto mt-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[24px] p-6 sm:p-8 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center"><Lock className="w-6 h-6" /></div>
        <h1 className="font-[Fraunces] text-2xl font-extrabold mt-4">Login Admin</h1>
        <p className="text-sm text-zinc-500 mt-1">Kelola dan pantau pemesanan masuk.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="block text-sm space-y-1.5">
            <span className="font-bold">Username</span>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin" autoComplete="username" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </label>
          <label className="block text-sm space-y-1.5">
            <span className="font-bold">Password</span>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </label>
          {err && <p className="text-xs text-rose-500 flex items-center gap-1 font-bold"><AlertCircle className="w-3.5 h-3.5" /> {err}</p>}
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-full text-sm">Masuk Dashboard</button>
        </form>
        <p className="text-[11px] text-zinc-400 mt-4 text-center">Demo: username <b>admin</b> · password <b>gowes123</b> (ganti di <span className="font-mono">store.tsx</span>)</p>
        <p className="text-[11px] text-zinc-400 mt-1 text-center">Bukan admin? <Link to="/" className="underline font-bold">Kembali sewa sepeda</Link></p>
      </motion.div>
    </div>
  )
}
