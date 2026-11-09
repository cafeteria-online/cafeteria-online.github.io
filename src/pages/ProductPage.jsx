import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'
import { useCart } from '../state/CartContext.jsx'
import { formatPrice } from '../lib/format.js'
import { buildOrderMessage, hasValidPhone, whatsappLink } from '../lib/whatsapp.js'

// Página propia de cada producto: es el enlace que viaja en el mensaje de WhatsApp.
export default function ProductPage() {
  const { code } = useParams()
  const { settings, sections, products } = useData()
  const { add, setOpen } = useCart()
  const [qty, setQty] = useState(1)

  const product = products.find((p) => p.code === code?.toUpperCase())
  if (!product) {
    return (
      <main className="container page-msg">
        <h1>No encontramos ese producto</h1>
        <p className="muted">El código «{code}» no existe o fue retirado del menú.</p>
        <Link to="/" className="btn btn--primary">Volver al menú</Link>
      </main>
    )
  }

  const section = sections.find((s) => s.id === product.sectionId)
  const soldOut = !product.available
  const directMessage = buildOrderMessage([{ ...product, qty }], { businessName: settings.businessName })

  return (
    <main className="container product-page">
      <Link to="/" className="back-link">← Volver al menú</Link>
      <div className="product-page__grid">
        <div className="product-page__media">
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <div className="card__placeholder">✿</div>}
        </div>
        <div className="product-page__info">
          {section && <p className="kicker">{section.name}</p>}
          <h1>{product.name}</h1>
          <p className="code code--big">Código: {product.code}</p>
          <p className="product-page__price">{formatPrice(product.price)}</p>
          {product.description && <p>{product.description}</p>}

          {soldOut ? (
            <p className="tag tag--soldout tag--static">Agotado por hoy</p>
          ) : (
            <>
              <div className="qty qty--big">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Quitar uno">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Agregar uno">+</button>
              </div>
              <div className="product-page__actions">
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    add(product, qty)
                    setOpen(true)
                  }}
                >
                  Agregar al pedido
                </button>
                {hasValidPhone(settings.whatsapp) && (
                  <a
                    className="btn btn--whatsapp"
                    href={whatsappLink(settings.whatsapp, directMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pedir solo esto por WhatsApp
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
