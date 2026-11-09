import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { DataProvider, useData } from './state/DataContext.jsx'
import { CartProvider } from './state/CartContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import AdminApp from './admin/AdminApp.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Layout() {
  const { loading, error, settings, reload } = useData()

  if (loading) return <div className="splash"><span className="splash__flower">✿</span></div>
  if (error || !settings) {
    return (
      <main className="container page-msg">
        <h1>No pudimos cargar el menú</h1>
        <p className="muted">{error}</p>
        <button className="btn btn--primary" onClick={reload}>Reintentar</button>
      </main>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:code" element={<ProductPage />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <CartDrawer />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <DataProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </DataProvider>
    </HashRouter>
  )
}
