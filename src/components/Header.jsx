import { Link } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'
import { useCart } from '../state/CartContext.jsx'
import { isOpenNow } from '../lib/format.js'
import Cenefa from './Cenefa.jsx'

export default function Header() {
  const { settings } = useData()
  const { count, setOpen } = useCart()
  const open = isOpenNow(settings)

  return (
    <header className="header">
      <div className="header__bar container">
        <Link to="/" className="brand">
          <span className="brand__mark" aria-hidden="true">✿</span>
          <span className="brand__name">{settings?.businessName}</span>
        </Link>
        {open !== null && (
          <span className={`status ${open ? 'status--open' : 'status--closed'}`}>
            {open ? 'Abierto' : 'Cerrado'}
          </span>
        )}
        <button className="cart-btn" onClick={() => setOpen(true)} aria-label={`Ver pedido, ${count} productos`}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path fill="currentColor" d="M7 4h-2a1 1 0 0 0 0 2h1.2l2.2 9.2A2 2 0 0 0 10.3 17H18a1 1 0 0 0 0-2h-7.7l-.3-1H18a1 1 0 0 0 1-.8l1.4-6A1 1 0 0 0 19.4 6H7.6L7 4zm3 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          </svg>
          <span className="cart-btn__label">Mi pedido</span>
          {count > 0 && <span className="cart-btn__badge">{count}</span>}
        </button>
      </div>
      <Cenefa />
    </header>
  )
}
