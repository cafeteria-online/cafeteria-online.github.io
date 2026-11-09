const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

export const formatPrice = (n) => money.format(Number(n) || 0)

export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// Abierto/cerrado según la hora local del visitante.
export function isOpenNow(settings, now = new Date()) {
  const { openTime, closeTime, openDays } = settings || {}
  if (!openTime || !closeTime || !Array.isArray(openDays)) return null
  if (!openDays.includes(now.getDay())) return false
  const mins = now.getHours() * 60 + now.getMinutes()
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  return mins >= toMin(openTime) && mins < toMin(closeTime)
}

export function scheduleText(settings) {
  const { openTime, closeTime, openDays } = settings || {}
  if (!openTime || !closeTime || !openDays?.length) return ''
  const sorted = [...openDays].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
  const days =
    sorted.length === 7
      ? 'Todos los días'
      : sorted.map((d) => DAY_NAMES[d].slice(0, 3)).join(', ')
  return `${days} · ${openTime} a ${closeTime}`
}
