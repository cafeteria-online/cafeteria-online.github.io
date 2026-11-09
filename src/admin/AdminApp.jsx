import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, MODE } from '../lib/api.js'
import Login from './Login.jsx'
import ProductsAdmin from './ProductsAdmin.jsx'
import SectionsAdmin from './SectionsAdmin.jsx'
import SettingsAdmin from './SettingsAdmin.jsx'

const TABS = [
  { id: 'productos', label: 'Productos', Component: ProductsAdmin },
  { id: 'secciones', label: 'Secciones', Component: SectionsAdmin },
  { id: 'pagina', label: 'Página', Component: SettingsAdmin },
]

export default function AdminApp() {
  const [user, setUser] = useState(undefined) // undefined = comprobando
  const [admin, setAdmin] = useState(false)
  const [tab, setTab] = useState('productos')

  useEffect(() => {
    let alive = true
    const update = async (u) => {
      const ok = u ? await api.isAdmin() : false
      if (!alive) return
      setUser(u)
      setAdmin(ok)
    }
    api.getUser().then(update)
    const unsubscribe = api.onAuthChange(update)
    return () => {
      alive = false
      unsubscribe()
    }
  }, [])

  if (user === undefined) return <main className="container page-msg"><p>Cargando…</p></main>
  if (!user) return <Login />
  if (!admin) {
    return (
      <main className="container page-msg">
        <h1>Sin permiso</h1>
        <p>La cuenta {user.email} no está registrada como administradora.</p>
        <button className="btn btn--primary" onClick={() => api.signOut()}>Cerrar sesión</button>
      </main>
    )
  }

  const Current = TABS.find((t) => t.id === tab).Component
  return (
    <main className="container admin">
      <div className="admin__top">
        <div>
          <h1>Panel de administración</h1>
          <p className="muted small">Sesión: {user.email}</p>
        </div>
        <div className="admin__top-actions">
          <Link to="/" className="btn btn--light btn--sm">Ver la página</Link>
          <button className="btn btn--ghost btn--sm" onClick={() => api.signOut()}>Cerrar sesión</button>
        </div>
      </div>

      {MODE === 'demo' && (
        <p className="notice">
          <strong>Modo demostración:</strong> los cambios se guardan solo en este navegador.{' '}
          <button className="link-btn" onClick={() => { api.resetDemo(); window.location.reload() }}>
            Restaurar datos de ejemplo
          </button>
        </p>
      )}

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            className={`tabs__btn ${tab === t.id ? 'tabs__btn--active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <Current />
    </main>
  )
}
