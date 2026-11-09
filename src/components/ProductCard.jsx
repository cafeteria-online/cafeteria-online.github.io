import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format.js'
import { useCart } from '../state/CartContext.jsx'

export default function ProductCard({ product }) {
  const { add, setOpen } = useCart()
  const soldOut = !product.available

  return (
    <article className={`card ${soldOut ? 'card--soldout' : ''}`}>
      <Link to={`/p/${product.code}`} className="card__media">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="card__placeholder" aria-hidden="true">✿</div>
        )}
        {product.featured && !soldOut && <span className="tag tag--featured">Favorito</span>}
        {soldOut && <span className="tag tag--soldout">Agotado</span>}
      </Link>
      <div className="card__body">
        <div className="card__head">
          <h3 className="card__title">
            <Link to={`/p/${product.code}`}>{product.name}</Link>
          </h3>
          <span className="card__price">{formatPrice(product.price)}</span>
        </div>
        {product.description && <p className="card__desc">{product.description}</p>}
        <div className="card__foot">
          <span className="code" title="Código del producto">{product.code}</span>
          <button
            className="btn btn--primary btn--sm"
            disabled={soldOut}
            onClick={() => {
              add(product)
              setOpen(true)
            }}
          >
            {soldOut ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}
