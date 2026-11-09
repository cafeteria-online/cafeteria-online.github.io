import { useData } from '../state/DataContext.jsx'
import { useCart } from '../state/CartContext.jsx'
import { scheduleText } from '../lib/format.js'
import ProductCard from '../components/ProductCard.jsx'
import Cenefa from '../components/Cenefa.jsx'

export default function Home() {
  const { settings, sections, products } = useData()
  const { setOpen } = useCart()
  const visibleSections = sections.filter((s) => s.visible)
  const productsOf = (id) => products.filter((p) => p.sectionId === id)
  const featured = products.filter(
    (p) => p.featured && p.available && visibleSections.some((s) => s.id === p.sectionId)
  )

  return (
    <>
      <section className="hero" style={{ '--hero-img': settings.heroImage ? `url("${settings.heroImage}")` : 'none' }}>
        <div className="hero__inner container">
          <p className="hero__kicker">{settings.tagline}</p>
          <h1>{settings.heroTitle}</h1>
          <p className="hero__text">{settings.heroText}</p>
          <div className="hero__actions">
            <a href="#menu" className="btn btn--primary" onClick={scrollTo('menu')}>Ver el menú</a>
            <button className="btn btn--light" onClick={() => setOpen(true)}>Mi pedido</button>
          </div>
          {scheduleText(settings) && <p className="hero__schedule">{scheduleText(settings)}</p>}
        </div>
      </section>

      <nav className="section-nav" aria-label="Secciones del menú">
        <div className="container section-nav__list">
          {visibleSections.map((s) => (
            <a key={s.id} href={`#sec-${s.prefix}`} onClick={scrollTo(`sec-${s.prefix}`)}>
              {s.name}
            </a>
          ))}
        </div>
      </nav>

      <main id="menu" className="container menu">
        {featured.length > 0 && (
          <section className="menu-section">
            <header className="menu-section__head">
              <h2>Los favoritos de la casa</h2>
            </header>
            <div className="grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {visibleSections.map((s) => {
          const list = productsOf(s.id)
          if (!list.length) return null
          return (
            <section key={s.id} id={`sec-${s.prefix}`} className="menu-section">
              <header className="menu-section__head">
                <h2>{s.name}</h2>
                {s.description && <p className="muted">{s.description}</p>}
              </header>
              <div className="grid">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )
        })}
      </main>

      {(settings.aboutTitle || settings.aboutText) && (
        <section className="about">
          <Cenefa />
          <div className="container about__inner">
            {settings.aboutImage && <img src={settings.aboutImage} alt="" className="about__img" loading="lazy" />}
            <div>
              <h2>{settings.aboutTitle}</h2>
              <p>{settings.aboutText}</p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

// Con HashRouter los enlaces "#id" chocarían con la ruta; se hace scroll manual.
function scrollTo(id) {
  return (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
