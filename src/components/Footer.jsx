import { Link } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'
import { scheduleText } from '../lib/format.js'
import Cenefa from './Cenefa.jsx'

export default function Footer() {
  const { settings } = useData()
  if (!settings) return null
  return (
    <footer className="footer">
      <Cenefa />
      <div className="container footer__grid">
        <div>
          <h3>{settings.businessName}</h3>
          <p>{settings.footerText}</p>
        </div>
        <div>
          <h4>Visítanos</h4>
          <p>{settings.address}</p>
          <p>{scheduleText(settings)}</p>
          {settings.mapsUrl && (
            <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">Ver en el mapa</a>
          )}
        </div>
        <div className="footer__links">
          <h4>Síguenos</h4>
          {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
          <Link to="/admin" className="footer__admin">Administración</Link>
        </div>
      </div>
    </footer>
  )
}
