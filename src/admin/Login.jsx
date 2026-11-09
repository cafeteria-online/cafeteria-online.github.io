import { useState } from 'react'
import { api, MODE } from '../lib/api.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.signIn(email.trim(), password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container login">
      <form className="panel login__form" onSubmit={submit}>
        <h1>Administración</h1>
        {MODE === 'demo' ? (
          <>
            <p className="notice">
              <strong>Modo demostración.</strong> No hay base de datos conectada: los cambios se guardan solo en
              este navegador. Entra sin contraseña para probar el panel.
            </p>
            <button className="btn btn--primary btn--block" disabled={busy}>Entrar a la demostración</button>
          </>
        ) : (
          <>
            <label>
              Correo
              <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Contraseña
              <input type="password" autoComplete="current-password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn--primary btn--block" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
          </>
        )}
      </form>
    </main>
  )
}
