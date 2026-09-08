import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ShopProvider } from './store'
import { Header, Footer, Toasts, BottomNav, FloatingCartBar, CartSheet, FloatingWA } from './components/chrome'
import Beranda from './pages/Beranda'
import Pemesanan from './pages/Pemesanan'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <ShopProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#fffef7] dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 antialiased selection:bg-emerald-200">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Beranda />} />
              <Route path="/pemesanan" element={<Pemesanan />} />
              <Route path="*" element={<Beranda />} />
            </Routes>
          </main>
          <Footer />
          <FloatingCartBar />
          <CartSheet />
          <BottomNav />
          <FloatingWA />
          <Toasts />
        </div>
      </HashRouter>
    </ShopProvider>
  )
}
