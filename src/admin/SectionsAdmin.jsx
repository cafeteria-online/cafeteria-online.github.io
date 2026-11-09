import { useState } from 'react'
import { api } from '../lib/api.js'
import { useData } from '../state/DataContext.jsx'

// Prefijo sugerido a partir del nombre: "Pan dulce" → "PAN"
const suggestPrefix = (name) =>
  name.normalize('NFD').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()

export default function SectionsAdmin() {
  const { sections, products, reload } = useData()
  const [editing, setEditing] = useState(null)
  const [msg, setMsg] = useState('')

  async function run(fn, okMsg) {
    try {
      await fn()
      await reload()
      if (okMsg) setMsg(okMsg)
    } catch (e) {
      setMsg(e.message)
    }
  }

  const move = (i, dir) => {
    const a = sections[i]
    const b = sections[i + dir]
    if (b) run(() => Promise.all([api.saveSection({ ...a, sort: b.sort }), api.saveSection({ ...b, sort: a.sort })]))
  }

  const remove = (s) => {
    const n = products.filter((p) => p.sectionId === s.id).length
    if (n) return setMsg(`«${s.name}» tiene ${n} producto(s). Muévelos o bórralos antes de borrar la sección.`)
    if (confirm(`¿Borrar la sección «${s.name}»?`)) run(() => api.deleteSection(s.id), 'Sección borrada.')
  }

  return (
    <section>
      <div className="toolbar">
        <p className="muted small toolbar__hint">Las secciones agrupan el menú. Ordénalas con las flechas u ocúltalas sin borrarlas.</p>
        <button className="btn btn--primary" onClick={() => setEditing({})}>+ Nueva sección</button>
      </div>
      {msg && <p className="notice" role="status">{msg}</p>}

      <ul className="admin-list">
        {sections.map((s, i) => (
          <li key={s.id} className="admin-row">
            <span className="admin-row__ph code">{s.prefix}</span>
            <div className="admin-row__info">
              <strong>{s.name}</strong>
              <span className="small muted">{products.filter((p) => p.sectionId === s.id).length} productos · {s.description}</span>
            </div>
            <div className="admin-row__toggles">
              <label className="switch">
                <input type="checkbox" checked={s.visible}
                  onChange={() => run(() => api.saveSection({ ...s, visible: !s.visible }))} /> Visible
              </label>
            </div>
            <div className="admin-row__actions">
              <button className="icon-btn" title="Subir" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button className="icon-btn" title="Bajar" onClick={() => move(i, 1)} disabled={i === sections.length - 1}>↓</button>
              <button className="btn btn--sm btn--light" onClick={() => setEditing(s)}>Editar</button>
              <button className="btn btn--sm btn--danger" onClick={() => remove(s)}>Borrar</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <SectionForm
          section={editing}
          onClose={() => setEditing(null)}
          onSave={(data) =>
            run(async () => {
              await api.saveSection(data)
              setEditing(null)
            }, `Sección «${data.name}» guardada.`)
          }
        />
      )}
    </section>
  )
}

function SectionForm({ section, onClose, onSave }) {
  const { sections } = useData()
  const isNew = !section.id
  const [form, setForm] = useState({ name: '', prefix: '', description: '', visible: true, ...section })
  const [touchedPrefix, setTouchedPrefix] = useState(!isNew)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const prefix = form.prefix.trim().toUpperCase()
    if (!/^[A-Z]{2,4}$/.test(prefix)) return setError('El prefijo debe tener de 2 a 4 letras sin acentos, p. ej. PAN.')
    setBusy(true)
    const sort = isNew ? Math.max(0, ...sections.map((s) => s.sort)) + 1 : form.sort
    await onSave({ ...form, prefix, sort, name: form.name.trim() })
    setBusy(false)
  }

  return (
    <div className="modal" role="dialog" aria-label={isNew ? 'Nueva sección' : 'Editar sección'}>
      <div className="modal__backdrop" onClick={onClose} />
      <form className="modal__panel modal__panel--narrow panel" onSubmit={submit}>
        <h2>{isNew ? 'Nueva sección' : `Editar «${section.name}»`}</h2>
        <label>
          Nombre
          <input value={form.name} required maxLength={60}
            onChange={(e) => {
              const name = e.target.value
              setForm((f) => ({ ...f, name, prefix: touchedPrefix ? f.prefix : suggestPrefix(name) }))
            }} />
        </label>
        <label>
          Prefijo de códigos (2–4 letras)
          <input value={form.prefix} required maxLength={4}
            onChange={(e) => {
              setTouchedPrefix(true)
              setForm((f) => ({ ...f, prefix: e.target.value.toUpperCase() }))
            }} />
          <span className="small muted">
            Los productos nuevos de esta sección tendrán códigos como {form.prefix || 'XXX'}-001.
            {!isNew && ' Cambiarlo no modifica los códigos ya existentes.'}
          </span>
        </label>
        <label>
          Descripción corta
          <input value={form.description} maxLength={140} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </label>
        <label className="switch">
          <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} /> Visible en la página
        </label>
        {error && <p className="error-text">{error}</p>}
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary" disabled={busy}>Guardar</button>
        </div>
      </form>
    </div>
  )
}
