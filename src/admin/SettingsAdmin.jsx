import { useState } from 'react'
import { api } from '../lib/api.js'
import { DAY_NAMES } from '../lib/format.js'
import { hasValidPhone } from '../lib/whatsapp.js'
import { useData } from '../state/DataContext.jsx'
import ImageField, { commitImage } from './ImageField.jsx'

const TEXT_FIELDS = [
  { group: 'Negocio', fields: [
    ['businessName', 'Nombre del negocio'],
    ['tagline', 'Frase corta (aparece sobre el título)'],
    ['whatsapp', 'WhatsApp para pedidos (con lada de país, p. ej. 521 + 10 dígitos)'],
  ] },
  { group: 'Portada', fields: [
    ['heroTitle', 'Título principal'],
    ['heroText', 'Texto de bienvenida', 'textarea'],
  ] },
  { group: 'Sección «Nuestra tradición»', fields: [
    ['aboutTitle', 'Título'],
    ['aboutText', 'Texto', 'textarea'],
  ] },
  { group: 'Ubicación y redes', fields: [
    ['address', 'Dirección'],
    ['mapsUrl', 'Enlace de Google Maps (opcional)'],
    ['instagram', 'Enlace de Instagram (opcional)'],
    ['facebook', 'Enlace de Facebook (opcional)'],
    ['footerText', 'Texto del pie de página'],
  ] },
]

export default function SettingsAdmin() {
  const { settings, reload } = useData()
  const [form, setForm] = useState(settings)
  const [hero, setHero] = useState({ url: settings.heroImage || '', blob: null })
  const [about, setAbout] = useState({ url: settings.aboutImage || '', blob: null })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggleDay = (d) =>
    setForm((f) => ({ ...f, openDays: f.openDays.includes(d) ? f.openDays.filter((x) => x !== d) : [...f.openDays, d] }))

  async function submit(e) {
    e.preventDefault()
    if (!hasValidPhone(form.whatsapp)) {
      setMsg('Revisa el número de WhatsApp: solo dígitos, con lada de país (p. ej. 5219611234567).')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      const heroImage = await commitImage(api, hero, settings.heroImage, 'pagina')
      const aboutImage = await commitImage(api, about, settings.aboutImage, 'pagina')
      const whatsapp = form.whatsapp.replace(/\D/g, '')
      await api.saveSettings({ ...form, whatsapp, heroImage, aboutImage })
      setHero({ url: heroImage, blob: null })
      setAbout({ url: aboutImage, blob: null })
      await reload()
      setMsg('Cambios guardados. Ya se ven en la página.')
    } catch (err) {
      setMsg(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="settings" onSubmit={submit}>
      {TEXT_FIELDS.map(({ group, fields }) => (
        <fieldset key={group} className="panel">
          <legend>{group}</legend>
          {fields.map(([key, label, type]) => (
            <label key={key}>
              {label}
              {type === 'textarea' ? (
                <textarea rows={3} value={form[key] || ''} onChange={set(key)} />
              ) : (
                <input value={form[key] || ''} onChange={set(key)} />
              )}
            </label>
          ))}
          {group === 'Portada' && <ImageField label="Foto de portada" preset="hero" value={hero} onChange={setHero} />}
          {group.startsWith('Sección') && <ImageField label="Foto" preset="about" value={about} onChange={setAbout} />}
        </fieldset>
      ))}

      <fieldset className="panel">
        <legend>Horario</legend>
        <div className="row">
          <label>Abre<input type="time" value={form.openTime || ''} onChange={set('openTime')} /></label>
          <label>Cierra<input type="time" value={form.closeTime || ''} onChange={set('closeTime')} /></label>
        </div>
        <div className="days">
          {DAY_NAMES.map((d, i) => (
            <label key={d} className="switch">
              <input type="checkbox" checked={form.openDays?.includes(i) || false} onChange={() => toggleDay(i)} /> {d}
            </label>
          ))}
        </div>
      </fieldset>

      {msg && <p className="notice" role="status">{msg}</p>}
      <div className="settings__save">
        <button className="btn btn--primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar cambios'}</button>
      </div>
    </form>
  )
}
