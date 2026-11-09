import { formatPrice } from './format.js'

// Enlace público de un producto, para que cliente y vendedor vean el mismo producto.
export function productUrl(code) {
  return `${window.location.origin}${window.location.pathname}#/p/${code}`
}

// Mensaje de pedido. Cada línea lleva el CÓDIGO del producto (p. ej. QCH-002),
// así el vendedor identifica exactamente qué se pidió aunque cambien los nombres.
export function buildOrderMessage(items, { name = '', notes = '', businessName = '' } = {}) {
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  const lines = [`¡Hola${businessName ? ` ${businessName}` : ''}! Quiero hacer este pedido:`, '']
  for (const it of items) {
    lines.push(`• ${it.qty} × ${it.name} [${it.code}] — ${formatPrice(it.price)} c/u`)
    lines.push(`  ${productUrl(it.code)}`)
  }
  lines.push('', `*Total: ${formatPrice(total)}*`)
  if (name.trim()) lines.push(`Nombre: ${name.trim()}`)
  if (notes.trim()) lines.push(`Notas: ${notes.trim()}`)
  return lines.join('\n')
}

export function whatsappLink(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export const hasValidPhone = (phone) => /^\d{10,15}$/.test(String(phone || '').replace(/\D/g, ''))
