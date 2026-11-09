// Capa de datos. Tiene dos modos con la misma interfaz:
//  - "supabase": datos reales (cuando existen VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY).
//  - "demo": sin backend; los cambios se guardan solo en este navegador (localStorage).
import { createClient } from '@supabase/supabase-js'
import { seedSettings, seedSections, seedProducts } from '../data/seed.js'
import { blobToDataUrl } from './image.js'

const URL_ = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const BUCKET = 'imagenes'

export const supabase = URL_ && KEY ? createClient(URL_, KEY) : null
export const MODE = supabase ? 'supabase' : 'demo'

// ---------- Conversión entre filas de la BD y objetos de la app ----------
const toSection = (r) => ({
  id: r.id,
  name: r.name,
  prefix: r.prefix,
  description: r.description,
  sort: r.sort,
  visible: r.visible,
})
const toProduct = (r) => ({
  id: r.id,
  code: r.code,
  sectionId: r.section_id,
  name: r.name,
  description: r.description,
  price: Number(r.price),
  imageUrl: r.image_url,
  available: r.available,
  featured: r.featured,
  sort: r.sort,
})
const fromProduct = (p) => ({
  code: p.code,
  section_id: p.sectionId,
  name: p.name,
  description: p.description,
  price: p.price,
  image_url: p.imageUrl,
  available: p.available,
  featured: p.featured,
  sort: p.sort,
  updated_at: new Date().toISOString(),
})

function friendlyError(error) {
  const msg = error?.message || String(error)
  if (error?.code === '23505') return new Error('Ya existe un registro con ese código o prefijo.')
  if (error?.code === '23503') return new Error('No se puede borrar: la sección todavía tiene productos.')
  if (error?.code === '23514') return new Error('Algún dato no tiene el formato correcto.')
  if (/row-level security|permission/i.test(msg)) return new Error('No tienes permiso de administrador.')
  return new Error(msg)
}
const check = ({ data, error }) => {
  if (error) throw friendlyError(error)
  return data
}

// =====================================================================
// Modo Supabase
// =====================================================================
const supabaseApi = {
  async loadAll() {
    const [settings, sections, products] = await Promise.all([
      supabase.from('settings').select('data').eq('id', 1).maybeSingle().then(check),
      supabase.from('sections').select('*').order('sort').then(check),
      supabase.from('products').select('*').order('sort').then(check),
    ])
    return {
      settings: { ...seedSettings, ...(settings?.data || {}) },
      sections: sections.map(toSection),
      products: products.map(toProduct),
    }
  },

  async saveSettings(data) {
    await supabase
      .from('settings')
      .upsert({ id: 1, data, updated_at: new Date().toISOString() })
      .then(check)
  },

  async saveSection(s) {
    const row = {
      name: s.name,
      prefix: s.prefix,
      description: s.description,
      sort: s.sort,
      visible: s.visible,
    }
    const query = s.id
      ? supabase.from('sections').update(row).eq('id', s.id)
      : supabase.from('sections').insert(row)
    return toSection(await query.select().single().then(check))
  },

  async deleteSection(id) {
    await supabase.from('sections').delete().eq('id', id).then(check)
  },

  async saveProduct(p) {
    const row = fromProduct(p)
    const query = p.id
      ? supabase.from('products').update(row).eq('id', p.id)
      : supabase.from('products').insert(row)
    return toProduct(await query.select().single().then(check))
  },

  async deleteProduct(id) {
    await supabase.from('products').delete().eq('id', id).then(check)
  },

  async uploadImage(blob, folder) {
    const path = `${folder}/${crypto.randomUUID()}.webp`
    await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' })
      .then(check)
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  },

  // Borra una imagen propia que ya no se usa (las de Unsplash/Pexels se ignoran).
  async deleteImage(url) {
    const marker = `/storage/v1/object/public/${BUCKET}/`
    if (!url || !url.includes(marker)) return
    await supabase.storage.from(BUCKET).remove([url.split(marker)[1]])
  },

  async getUser() {
    const { data } = await supabase.auth.getSession()
    return data.session?.user ?? null
  },
  onAuthChange(cb) {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  },
  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Correo o contraseña incorrectos.')
  },
  async signOut() {
    await supabase.auth.signOut()
  },
  async isAdmin() {
    const { data, error } = await supabase.rpc('is_admin')
    return !error && data === true
  },
}

// =====================================================================
// Modo demostración (sin backend)
// =====================================================================
const DEMO_KEY = 'cafeteria-demo-v1'
const DEMO_SESSION = 'cafeteria-demo-session'
let authListeners = []

function demoSeed() {
  const sections = seedSections.map((s) => ({
    id: `sec-${s.key}`,
    name: s.name,
    prefix: s.prefix,
    description: s.description,
    sort: s.sort,
    visible: true,
  }))
  const products = seedProducts.map((p, i) => ({
    id: `prod-${p.code}`,
    code: p.code,
    sectionId: `sec-${p.section}`,
    name: p.name,
    description: p.description,
    price: p.price,
    imageUrl: p.image,
    available: true,
    featured: !!p.featured,
    sort: i + 1,
  }))
  return { settings: { ...seedSettings }, sections, products }
}

function readDemo() {
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* almacenamiento no disponible: se usan los datos de ejemplo */
  }
  return demoSeed()
}
function writeDemo(db) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(db))
  } catch {
    throw new Error('El navegador no pudo guardar (espacio lleno o bloqueado).')
  }
}
const sortBy = (list) => [...list].sort((a, b) => a.sort - b.sort)

const demoApi = {
  async loadAll() {
    const db = readDemo()
    return { ...db, sections: sortBy(db.sections), products: sortBy(db.products) }
  },
  async saveSettings(data) {
    writeDemo({ ...readDemo(), settings: data })
  },
  async saveSection(s) {
    const db = readDemo()
    if (db.sections.some((x) => x.prefix === s.prefix && x.id !== s.id))
      throw new Error('Ya existe una sección con ese prefijo.')
    const saved = { ...s, id: s.id || `sec-${crypto.randomUUID()}` }
    db.sections = s.id ? db.sections.map((x) => (x.id === s.id ? saved : x)) : [...db.sections, saved]
    writeDemo(db)
    return saved
  },
  async deleteSection(id) {
    const db = readDemo()
    if (db.products.some((p) => p.sectionId === id))
      throw new Error('No se puede borrar: la sección todavía tiene productos.')
    db.sections = db.sections.filter((x) => x.id !== id)
    writeDemo(db)
  },
  async saveProduct(p) {
    const db = readDemo()
    if (db.products.some((x) => x.code === p.code && x.id !== p.id))
      throw new Error('Ya existe un producto con ese código.')
    const saved = { ...p, id: p.id || `prod-${crypto.randomUUID()}` }
    db.products = p.id ? db.products.map((x) => (x.id === p.id ? saved : x)) : [...db.products, saved]
    writeDemo(db)
    return saved
  },
  async deleteProduct(id) {
    const db = readDemo()
    db.products = db.products.filter((x) => x.id !== id)
    writeDemo(db)
  },
  async uploadImage(blob) {
    return blobToDataUrl(blob)
  },
  async deleteImage() {},

  async getUser() {
    try {
      return sessionStorage.getItem(DEMO_SESSION) ? { email: 'demo@ejemplo.com' } : null
    } catch {
      return null
    }
  },
  onAuthChange(cb) {
    authListeners.push(cb)
    return () => (authListeners = authListeners.filter((f) => f !== cb))
  },
  async signIn() {
    try {
      sessionStorage.setItem(DEMO_SESSION, '1')
    } catch {
      /* sin almacenamiento: la sesión dura hasta recargar */
    }
    authListeners.forEach((f) => f({ email: 'demo@ejemplo.com' }))
  },
  async signOut() {
    try {
      sessionStorage.removeItem(DEMO_SESSION)
    } catch {
      /* nada que limpiar */
    }
    authListeners.forEach((f) => f(null))
  },
  async isAdmin() {
    return true
  },
  resetDemo() {
    try {
      localStorage.removeItem(DEMO_KEY)
    } catch {
      /* nada que limpiar */
    }
  },
}

export const api = supabase ? supabaseApi : demoApi
