import { useEffect, useRef, useState } from 'react'
import { IMAGE_PRESETS, resizeImage } from '../lib/image.js'

// Selector de imagen: ajusta la foto automáticamente (recorte + tamaño + WebP)
// y la deja "pendiente" hasta que se guarde el formulario.
// value: { url, blob }  → url es la imagen actual; blob, la nueva aún sin subir.
export default function ImageField({ label, preset = 'product', value, onChange }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { width, height } = IMAGE_PRESETS[preset]

  useEffect(() => {
    if (!value.blob) return setPreview('')
    const url = URL.createObjectURL(value.blob)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [value.blob])

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const blob = await resizeImage(file, IMAGE_PRESETS[preset])
      onChange({ ...value, blob })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const shown = preview || value.url
  return (
    <div className="image-field">
      <span className="image-field__label">{label}</span>
      <div className="image-field__box" style={{ aspectRatio: `${width} / ${height}` }}>
        {shown ? <img src={shown} alt="Vista previa" /> : <span className="muted">Sin imagen</span>}
        {busy && <span className="image-field__busy">Ajustando…</span>}
      </div>
      <div className="image-field__actions">
        <button type="button" className="btn btn--sm btn--light" onClick={() => inputRef.current?.click()} disabled={busy}>
          {shown ? 'Cambiar foto' : 'Subir foto'}
        </button>
        {shown && (
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => onChange({ url: '', blob: null })}>
            Quitar
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
      <p className="small muted">
        Se ajusta sola a {width}×{height} px y se comprime. {value.blob && 'Nueva foto lista: se sube al guardar.'}
      </p>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

// Sube la imagen pendiente (si hay) y borra la anterior si fue reemplazada o quitada.
export async function commitImage(api, image, previousUrl, folder) {
  let url = image.url
  if (image.blob) url = await api.uploadImage(image.blob, folder)
  if (previousUrl && previousUrl !== url) await api.deleteImage(previousUrl).catch(() => {})
  return url
}
