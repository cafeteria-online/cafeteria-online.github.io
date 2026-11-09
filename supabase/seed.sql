-- Datos de ejemplo genéricos. Generado con: npm run seed:sql
-- Ejecútalo en Supabase > SQL Editor DESPUÉS de schema.sql (solo una vez).

insert into public.settings (id, data) values (1, '{"businessName":"Café Ejemplo","tagline":"Café de altura, quesadillas chiapanecas y postres caseros","heroTitle":"Sabor de Chiapas en cada taza","heroText":"Café de los Altos, quesadillas al comal con quesillo y postres hechos en casa. Pide en línea y recibe la confirmación por WhatsApp.","heroImage":"https://images.pexels.com/photos/5836439/pexels-photo-5836439.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop","aboutTitle":"Nuestra tradición","aboutText":"Preparamos cada bebida con café de altura y cada quesadilla al momento, como se hace en las cocinas de Chiapas. Este texto es de ejemplo: edítalo desde el panel de administración.","aboutImage":"https://images.pexels.com/photos/19654049/pexels-photo-19654049.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop","whatsapp":"521XXXXXXXXXX","address":"Calle Ejemplo 123, Centro, Ciudad, Chiapas","mapsUrl":"","openTime":"08:00","closeTime":"21:00","openDays":[1,2,3,4,5,6],"instagram":"","facebook":"","footerText":"Hecho con cariño en Chiapas."}'::jsonb)
  on conflict (id) do nothing;

insert into public.sections (name, prefix, description, sort) values ('Café caliente', 'CAF', 'Café de altura de Chiapas, recién preparado.', 1)
  on conflict (prefix) do nothing;
insert into public.sections (name, prefix, description, sort) values ('Bebidas frías', 'BEB', 'Para los días de calor.', 2)
  on conflict (prefix) do nothing;
insert into public.sections (name, prefix, description, sort) values ('Quesadillas chiapanecas', 'QCH', 'Hechas al comal, con quesillo y tortilla recién hecha.', 3)
  on conflict (prefix) do nothing;
insert into public.sections (name, prefix, description, sort) values ('Postres', 'POS', 'Caseros, para acompañar tu café.', 4)
  on conflict (prefix) do nothing;

insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'CAF-001', id, 'Café de olla', 'Con canela y piloncillo, servido en jarrito de barro.', 35, 'https://images.unsplash.com/photo-1793721035698-e4d5d930f8df?w=800&h=800&fit=crop&auto=format&q=75', true, 1
  from public.sections where prefix = 'CAF'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'CAF-002', id, 'Americano de altura', 'Café chiapaneco de tueste medio.', 30, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=800&fit=crop&auto=format&q=75', false, 2
  from public.sections where prefix = 'CAF'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'CAF-003', id, 'Espresso', 'Carga doble, intenso y aromático.', 28, 'https://images.unsplash.com/photo-1772134141698-c47b78663c55?w=800&h=800&fit=crop&auto=format&q=75', false, 3
  from public.sections where prefix = 'CAF'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'CAF-004', id, 'Capuchino', 'Espresso con leche vaporizada y espuma.', 45, 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&h=800&fit=crop&auto=format&q=75', false, 4
  from public.sections where prefix = 'CAF'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'CAF-005', id, 'Chocolate de mesa', 'Chocolate artesanal batido con leche o agua.', 40, 'https://images.unsplash.com/photo-1546334169-864ef455d3f8?w=800&h=800&fit=crop&auto=format&q=75', false, 5
  from public.sections where prefix = 'CAF'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'BEB-001', id, 'Café helado', 'Café de altura con hielo y leche.', 45, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&h=800&fit=crop&auto=format&q=75', false, 6
  from public.sections where prefix = 'BEB'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'BEB-002', id, 'Frappé de café', 'Batido con hielo y crema.', 55, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=800&fit=crop&auto=format&q=75', false, 7
  from public.sections where prefix = 'BEB'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'BEB-003', id, 'Latte frío de canela', 'Leche fría, espresso y canela.', 50, 'https://images.unsplash.com/photo-1761673930163-8d3d6d73cd7a?w=800&h=800&fit=crop&auto=format&q=75', false, 8
  from public.sections where prefix = 'BEB'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'QCH-001', id, 'Quesadilla de quesillo', 'Tortilla al comal con quesillo derretido.', 30, 'https://images.pexels.com/photos/15662087/pexels-photo-15662087.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', true, 9
  from public.sections where prefix = 'QCH'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'QCH-002', id, 'Quesadilla de chipilín', 'Quesillo con hojas de chipilín, sabor chiapaneco.', 35, 'https://images.unsplash.com/photo-1628838233717-be047a0b54fb?w=800&h=800&fit=crop&auto=format&q=75', true, 10
  from public.sections where prefix = 'QCH'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'QCH-003', id, 'Quesadilla de chorizo', 'Quesillo con chorizo de la región.', 38, 'https://images.unsplash.com/photo-1673990349292-ed2dfa7988c9?w=800&h=800&fit=crop&auto=format&q=75', false, 11
  from public.sections where prefix = 'QCH'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'QCH-004', id, 'Quesadilla de hongos', 'Quesillo con hongos guisados y epazote.', 38, 'https://images.unsplash.com/photo-1741117126628-5ff5fdcfb7e4?w=800&h=800&fit=crop&auto=format&q=75', false, 12
  from public.sections where prefix = 'QCH'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'QCH-005', id, 'Orden mixta (3 piezas)', 'Una de cada: quesillo, chipilín y chorizo. Con salsa.', 95, 'https://images.unsplash.com/photo-1719957770167-bb66133ba808?w=800&h=800&fit=crop&auto=format&q=75', false, 13
  from public.sections where prefix = 'QCH'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'POS-001', id, 'Flan napolitano', 'Flan casero con caramelo.', 40, 'https://images.unsplash.com/photo-1780798465831-de1e4d58ee46?w=800&h=800&fit=crop&auto=format&q=75', true, 14
  from public.sections where prefix = 'POS'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'POS-002', id, 'Pastel tres leches', 'Rebanada suave y húmeda.', 50, 'https://images.unsplash.com/photo-1789776375267-5698cc77e184?w=800&h=800&fit=crop&auto=format&q=75', false, 15
  from public.sections where prefix = 'POS'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'POS-003', id, 'Pay de queso', 'Con mermelada de frutos rojos.', 48, 'https://images.unsplash.com/photo-1676300185983-d5f242babe34?w=800&h=800&fit=crop&auto=format&q=75', false, 16
  from public.sections where prefix = 'POS'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'POS-004', id, 'Brownie', 'Chocolate intenso, ideal con café.', 35, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=800&fit=crop&auto=format&q=75', false, 17
  from public.sections where prefix = 'POS'
  on conflict (code) do nothing;
insert into public.products (code, section_id, name, description, price, image_url, featured, sort)
  select 'POS-005', id, 'Pan de plátano', 'Rebanada de pan casero de plátano.', 32, 'https://images.unsplash.com/photo-1738605489199-4d39b213ae3b?w=800&h=800&fit=crop&auto=format&q=75', false, 18
  from public.sections where prefix = 'POS'
  on conflict (code) do nothing;
