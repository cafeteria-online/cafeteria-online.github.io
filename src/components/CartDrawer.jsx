import { useEffect, useState } from 'react'
import { useCart } from '../state/CartContext.jsx'
import { useData } from '../state/DataContext.jsx'
import { formatPrice } from '../lib/format.js'
import { buildOrderMessage, hasValidPhone, whatsappLink } from '../lib/whatsapp.js'

export default function CartDrawer() {
  const { items, open, setOpen, setQty, clear } = useCart()
  const { settings, products } = useData()
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  // Usa siempre el nombre y precio vigentes del menú (por si el admin los cambió).
  const lines = items.map((it) => {
    const current = products.find((p) => p.code === it.code)
    return current
      ? { ...it, name: current.name, price: current.price, imageUrl: current.imageUrl, unavailable: !current.available }
      : { ...it, unavailable: true }
  })
  const valid = lines.filter((l) => !l.unavailable)
  const total = valid.reduce((n, l) => n + l.price * l.qty, 0)
  const phoneOk = hasValidPhone(settings?.whatsapp)
  const message = buildOrderMessage(valid, { name, notes, businessName: settings?.businessName })

  return (
    <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''}>
      <div className="drawer__backdrop" onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-label="Tu pedido">
        <div className="drawer__head">
          <h2>Tu pedido</h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
        </div>

        {lines.length === 0 ? (
          <p className="muted drawer__empty">Aún no agregas productos. Elige algo rico del menú.</p>
        ) : (
          <>
            <ul className="cart-list">
              {lines.map((l) => (
                <li key={l.code} className={`cart-item ${l.unavailable ? 'cart-item--off' : ''}`}>
                  {l.imageUrl ? <img src={l.imageUrl} alt="" /> : <span className="cart-item__ph">✿</span>}
                  <div className="cart-item__info">
                    <strong>{l.name}</strong>
                    <span className="code">{l.code}</span>
                    {l.unavailable ? (
                      <span className="error-text">No disponible por ahora</span>
                    ) : (
                      <span className="muted">{formatPrice(l.price)} c/u</span>
                    )}
                  </div>
                  <div className="qty">
                    <button onClick={() => setQty(l.code, l.qty - 1)} aria-label="Quitar uno">−</button>
                    <span>{l.qty}</span>
                    <button onClick={() => setQty(l.code, l.qty + 1)} aria-label="Agregar uno" disabled={l.unavailable}>+</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer__form">
              <label>
                Tu nombre (opcional)
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
              </label>
              <label>
                Notas (opcional)
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  maxLength={300}
                  placeholder="Ej.: para llevar, sin salsa, paso a las 5 pm"
                />
              </label>
            </div>

            <div className="drawer__total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            {phoneOk ? (
              valid.length > 0 && (
                <a
                  className="btn btn--whatsapp btn--block"
                  href={whatsappLink(settings.whatsapp, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar pedido por WhatsApp
                </a>
              )
            ) : (
              <p className="error-text">El negocio aún no configura su número de WhatsApp.</p>
            )}
            <button className="btn btn--ghost btn--block" onClick={clear}>Vaciar pedido</button>
            <p className="small muted">
              Se abrirá WhatsApp con tu pedido ya escrito. Cada producto lleva su código para que no haya confusiones.
            </p>
          </>
        )}
      </aside>
    </div>
  )
}
