// Datos de ejemplo GENÉRICOS. Se usan en el modo demostración y para generar
// supabase/seed.sql (npm run seed:sql). Cámbialos después desde el panel admin.
// Fotos: Unsplash y Pexels (licencias gratuitas, uso comercial permitido). Ver CREDITOS.md.

const unsplash = (id, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`
const pexels = (id, w = 800, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`

export const seedSettings = {
  businessName: 'Café Ejemplo',
  tagline: 'Café de altura, quesadillas chiapanecas y postres caseros',
  heroTitle: 'Sabor de Chiapas en cada taza',
  heroText:
    'Café de los Altos, quesadillas al comal con quesillo y postres hechos en casa. Pide en línea y recibe la confirmación por WhatsApp.',
  heroImage: pexels('5836439', 1600, 900),
  aboutTitle: 'Nuestra tradición',
  aboutText:
    'Preparamos cada bebida con café de altura y cada quesadilla al momento, como se hace en las cocinas de Chiapas. Este texto es de ejemplo: edítalo desde el panel de administración.',
  aboutImage: pexels('19654049', 1200, 900),
  whatsapp: '521XXXXXXXXXX',
  address: 'Calle Ejemplo 123, Centro, Ciudad, Chiapas',
  mapsUrl: '',
  openTime: '08:00',
  closeTime: '21:00',
  openDays: [1, 2, 3, 4, 5, 6],
  instagram: '',
  facebook: '',
  footerText: 'Hecho con cariño en Chiapas.',
}

export const seedSections = [
  { key: 'caf', name: 'Café caliente', prefix: 'CAF', description: 'Café de altura de Chiapas, recién preparado.', sort: 1 },
  { key: 'beb', name: 'Bebidas frías', prefix: 'BEB', description: 'Para los días de calor.', sort: 2 },
  { key: 'qch', name: 'Quesadillas chiapanecas', prefix: 'QCH', description: 'Hechas al comal, con quesillo y tortilla recién hecha.', sort: 3 },
  { key: 'pos', name: 'Postres', prefix: 'POS', description: 'Caseros, para acompañar tu café.', sort: 4 },
]

export const seedProducts = [
  { section: 'caf', code: 'CAF-001', name: 'Café de olla', description: 'Con canela y piloncillo, servido en jarrito de barro.', price: 35, image: unsplash('1793721035698-e4d5d930f8df'), featured: true },
  { section: 'caf', code: 'CAF-002', name: 'Americano de altura', description: 'Café chiapaneco de tueste medio.', price: 30, image: unsplash('1514432324607-a09d9b4aefdd') },
  { section: 'caf', code: 'CAF-003', name: 'Espresso', description: 'Carga doble, intenso y aromático.', price: 28, image: unsplash('1772134141698-c47b78663c55') },
  { section: 'caf', code: 'CAF-004', name: 'Capuchino', description: 'Espresso con leche vaporizada y espuma.', price: 45, image: unsplash('1497636577773-f1231844b336') },
  { section: 'caf', code: 'CAF-005', name: 'Chocolate de mesa', description: 'Chocolate artesanal batido con leche o agua.', price: 40, image: unsplash('1546334169-864ef455d3f8') },

  { section: 'beb', code: 'BEB-001', name: 'Café helado', description: 'Café de altura con hielo y leche.', price: 45, image: unsplash('1517701550927-30cf4ba1dba5') },
  { section: 'beb', code: 'BEB-002', name: 'Frappé de café', description: 'Batido con hielo y crema.', price: 55, image: unsplash('1461023058943-07fcbe16d735') },
  { section: 'beb', code: 'BEB-003', name: 'Latte frío de canela', description: 'Leche fría, espresso y canela.', price: 50, image: unsplash('1761673930163-8d3d6d73cd7a') },

  { section: 'qch', code: 'QCH-001', name: 'Quesadilla de quesillo', description: 'Tortilla al comal con quesillo derretido.', price: 30, image: pexels('15662087'), featured: true },
  { section: 'qch', code: 'QCH-002', name: 'Quesadilla de chipilín', description: 'Quesillo con hojas de chipilín, sabor chiapaneco.', price: 35, image: unsplash('1628838233717-be047a0b54fb'), featured: true },
  { section: 'qch', code: 'QCH-003', name: 'Quesadilla de chorizo', description: 'Quesillo con chorizo de la región.', price: 38, image: unsplash('1673990349292-ed2dfa7988c9') },
  { section: 'qch', code: 'QCH-004', name: 'Quesadilla de hongos', description: 'Quesillo con hongos guisados y epazote.', price: 38, image: unsplash('1741117126628-5ff5fdcfb7e4') },
  { section: 'qch', code: 'QCH-005', name: 'Orden mixta (3 piezas)', description: 'Una de cada: quesillo, chipilín y chorizo. Con salsa.', price: 95, image: unsplash('1719957770167-bb66133ba808') },

  { section: 'pos', code: 'POS-001', name: 'Flan napolitano', description: 'Flan casero con caramelo.', price: 40, image: unsplash('1780798465831-de1e4d58ee46'), featured: true },
  { section: 'pos', code: 'POS-002', name: 'Pastel tres leches', description: 'Rebanada suave y húmeda.', price: 50, image: unsplash('1789776375267-5698cc77e184') },
  { section: 'pos', code: 'POS-003', name: 'Pay de queso', description: 'Con mermelada de frutos rojos.', price: 48, image: unsplash('1676300185983-d5f242babe34') },
  { section: 'pos', code: 'POS-004', name: 'Brownie', description: 'Chocolate intenso, ideal con café.', price: 35, image: unsplash('1606313564200-e75d5e30476c') },
  { section: 'pos', code: 'POS-005', name: 'Pan de plátano', description: 'Rebanada de pan casero de plátano.', price: 32, image: unsplash('1738605489199-4d39b213ae3b') },
]
