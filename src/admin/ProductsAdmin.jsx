import { useState } from 'react'
import { api } from '../lib/api.js'
import { formatPrice } from '../lib/format.js'
import { useData } from '../state/DataContext.jsx'
import ImageField, { commitImage } from './ImageField.jsx'

// Siguiente código libre para un prefijo: CAF-001, CAF-002…
export function nextCode(prefix, products) {
  const max = products
    .filter((p) => p.code.startsWith(`${prefix}-`))
    .reduce((m, p) => Math.max(m, Number(p.code.split('-')[1]) || 0), 0)
  return `${prefix}-${String(max + 1).padStart(3, '0')}`
}

export default function ProductsAdmin() {
  const { sections, products, reload } = useData()
  const [editing, setEditing] = useState(null) // producto en edición o {} para nuevo
  const [filter, setFilter] = useState('')
  const [msg, setMsg] = useState('')

  if (!sections.length) return <p className="notice">Primero crea una sección en la pestaña «Secciones».</p>

  const q = filter.trim().toLowerCase()
  const shown = products.filter((p) => !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))

  async function toggle(p, field) {
    try {
      await api.saveProduct({ ...p, [field]: !p[field] })
      await reload()
    } catch (e) {
      setMsg(e.message)
    }
  }

  async function move(list, index, dir) {
    const a = list[index]
    const b = list[index + dir]
    if (!b) return
    try {
      await Promise.all([api.saveProduct({ ...a, sort: b.sort }), api.saveProduct({ ...b, sort: a.sort })])
      await reload()
    } catch (e) {
      setMsg(e.message)
    }
  }

  async function remove(p) {
    if (!confirm(`¿Borrar «${p.name}» (${p.code})? Esta acción no se puede deshacer.`)) return
    try {
      await api.deleteProduct(p.id)
      await api.deleteImage(p.imageUrl).catch(() => {})
      await reload()
      setMsg(`Se borró ${p.code}.`)
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <section>
      <div className="toolbar">
        <input className="toolbar__search" placeholder="Buscar por nombre o código…" value={filter}
          onChange={(e) => setFilter(e.target.value)} />
        <button className="btn btn--primary" onClick={() => setEditing({})}>+ Nuevo producto</button>
      </div>
      {msg && <p className="notice" role="status">{msg}</p>}

      {sections.map((s) => {
        const list = shown.filter((p) => p.sectionId === s.id)
        return (
          <div key={s.id} className="admin-group">
            <h2>{s.name} <span className="muted small">({list.length})</span>{!s.visible && <span className="tag tag--muted">Oculta</span>}</h2>
            {list.length === 0 && <p className="muted small">Sin productos.</p>}
            <ul className="admin-list">
              {list.map((p, i) => (
                <li key={p.id} className="admin-row">
                  {p.imageUrl ? <img src={p.imageUrl} alt="" /> : <span className="admin-row__ph">✿</span>}
                  <div className="admin-row__info">
                    <strong>{p.name}</strong>
                    <span className="small"><span className="code">{p.code}</span> · {formatPrice(p.price)}</span>
                  </div>
                  <div className="admin-row__toggles">
                    <label className="switch"><input type="checkbox" checked={p.available} onChange={() => toggle(p, 'available')} /> Disponible</label>
                    <label className="switch"><input type="checkbox" checked={p.featured} onChange={() => toggle(p, 'featured')} /> Favorito</label>
                  </div>
                  <div className="admin-row__actions">
                    <button className="icon-btn" title="Subir" onClick={() => move(list, i, -1)} disabled={i === 0}>↑</button>
                    <button className="icon-btn" title="Bajar" onClick={() => move(list, i, 1)} disabled={i === list.length - 1}>↓</button>
                    <button className="btn btn--sm btn--light" onClick={() => setEditing(p)}>Editar</button>
                    <button className="btn btn--sm btn--danger" onClick={() => remove(p)}>Borrar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      {editing && (
        <ProductForm
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={async (saved) => {
            setEditing(null)
            await reload()
            setMsg(`Guardado: ${saved.name} (${saved.code}).`)
          }}
        />
      )}
    </section>
  )
}

function ProductForm({ product, onClose, onSaved }) {
  const { sections, products } = useData()
  const isNew = !product.id
  const firstSection = sections[0]
  const [form, setForm] = useState(() => ({
    sectionId: firstSection.id,
    code: nextCode(firstSection.prefix, products),
    name: '',
    description: '',
    price: '',
    available: true,
    featured: false,
    ...product,
  }))
  const [image, setImage] = useState({ url: product.imageUrl || '', blob: null })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  function changeSection(e) {
    const sectionId = e.target.value
    const prefix = sections.find((s) => s.id === sectionId).prefix
    // En productos nuevos el código sigue a la sección; en existentes se conserva
    // para que los pedidos y enlaces ya enviados por WhatsApp sigan siendo válidos.
    setForm((f) => ({ ...f, sectionId, code: isNew ? nextCode(prefix, products) : f.code }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    const code = form.code.trim().toUpperCase()
    const price = Number(form.price)
    if (!/^[A-Z]{2,4}-\d{3}$/.test(code)) return setError('El código debe ser como CAF-001.')
    if (!(price >= 0)) return setError('Escribe un precio válido.')
    setBusy(true)
    try {
      const imageUrl = await commitImage(api, image, product.imageUrl, 'productos')
      const sort = isNew ? Math.max(0, ...products.map((p) => p.sort)) + 1 : form.sort
      const saved = await api.saveProduct({ ...form, code, price, imageUrl, sort, name: form.name.trim() })
      await onSaved(saved)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="modal" role="dialog" aria-label={isNew ? 'Nuevo producto' : 'Editar producto'}>
      <div className="modal__backdrop" onClick={busy ? undefined : onClose} />
      <form className="modal__panel panel" onSubmit={submit}>
        <h2>{isNew ? 'Nuevo producto' : `Editar ${product.code}`}</h2>
        <div className="form-grid">
          <div className="form-grid__main">
            <label>
              Nombre
              <input value={form.name} onChange={set('name')} required maxLength={80} />
            </label>
            <label>
              Descripción
              <textarea value={form.description} onChange={set('description')} rows={3} maxLength={300} />
            </label>
            <div className="row">
              <label>
                Precio (MXN)
                <input type="number" min="0" step="0.5" value={form.price} onChange={set('price')} required />
              </label>
              <label>
                Sección
                <select value={form.sectionId} onChange={changeSection}>
                  {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
            </div>
            <label>
              Código (lo verá el cliente en WhatsApp)
              <input value={form.code} onChange={set('code')} required pattern="[A-Za-z]{2,4}-\d{3}" />
            </label>
            <div className="row">
              <label className="switch"><input type="checkbox" checked={form.available} onChange={set('available')} /> Disponible</label>
              <label className="switch"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Favorito de la casa</label>
            </div>
          </div>
          <ImageField label="Foto" preset="product" value={image} onChange={setImage} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>Cancelar</button>
          <button className="btn btn--primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  )
}
