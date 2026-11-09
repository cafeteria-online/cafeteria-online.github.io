// Genera supabase/seed.sql a partir de src/data/seed.js
// Uso: npm run seed:sql
import { writeFileSync } from 'node:fs'
import { seedSettings, seedSections, seedProducts } from '../src/data/seed.js'

const q = (v) => `'${String(v).replace(/'/g, "''")}'`

const lines = [
  '-- Datos de ejemplo genéricos. Generado con: npm run seed:sql',
  '-- Ejecútalo en Supabase > SQL Editor DESPUÉS de schema.sql (solo una vez).',
  '',
  `insert into public.settings (id, data) values (1, ${q(JSON.stringify(seedSettings))}::jsonb)`,
  '  on conflict (id) do nothing;',
  '',
]

for (const s of seedSections) {
  lines.push(
    `insert into public.sections (name, prefix, description, sort) values (${q(s.name)}, ${q(s.prefix)}, ${q(s.description)}, ${s.sort})`,
    '  on conflict (prefix) do nothing;'
  )
}
lines.push('')

seedProducts.forEach((p, i) => {
  const prefix = seedSections.find((s) => s.key === p.section).prefix
  lines.push(
    'insert into public.products (code, section_id, name, description, price, image_url, featured, sort)',
    `  select ${q(p.code)}, id, ${q(p.name)}, ${q(p.description)}, ${p.price}, ${q(p.image)}, ${!!p.featured}, ${i + 1}`,
    `  from public.sections where prefix = ${q(prefix)}`,
    '  on conflict (code) do nothing;'
  )
})

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), lines.join('\n') + '\n')
console.log('supabase/seed.sql generado')
