# Cafetería Online

Menú en línea para una cafetería con **café de altura, quesadillas estilo Chiapas y postres**.
Los clientes arman su pedido y lo envían por **WhatsApp**; cada producto lleva un **código único**
(p. ej. `QCH-002`) y un enlace propio, para que cliente y vendedor sepan exactamente de qué producto se habla.

Incluye un **panel de administración** con inicio de sesión para editar productos, secciones,
textos, horario y fotos (que se ajustan de tamaño automáticamente).

- Frontend: React 18 + Vite, publicado en **GitHub Pages**.
- Backend: **Supabase** (base de datos, inicio de sesión y almacenamiento de fotos), plan gratuito.
- Sin Supabase configurado, la página funciona en **modo demostración** (los cambios solo se guardan en tu navegador).

📘 Guía para usar la página y el panel: [docs/GUIA-DE-USO.md](docs/GUIA-DE-USO.md)

---

## Probar en tu computadora

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:5173. Sin archivo `.env`, arranca en modo demostración.

## Configurar Supabase (una sola vez)

1. Crea una cuenta gratuita en https://supabase.com y un proyecto nuevo (región: la más cercana, p. ej. *East US*).
2. En **SQL Editor → New query**, pega y ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. (Opcional) Ejecuta también [`supabase/seed.sql`](supabase/seed.sql) para cargar el menú de ejemplo.
4. **Crea tu usuario administrador:** *Authentication → Users → Add user → Create new user*
   (marca *Auto Confirm User*). Usa tu correo y una contraseña fuerte.
5. **Dale permiso de administrador:** en *SQL Editor* ejecuta (cambiando el correo):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'tu-correo@ejemplo.com';
   ```
6. **Desactiva el registro público:** *Authentication → Sign In / Providers → Email* → desactiva
   *Allow new users to sign up*. Así nadie más puede crear cuentas.
7. Copia los datos de conexión en *Project Settings → API*:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

   ⚠️ La clave **`service_role` nunca** se usa en este proyecto ni se comparte.

Para probar en local con Supabase, copia `.env.example` como `.env` y pega esos dos valores.
El archivo `.env` está en `.gitignore` y no se sube al repositorio.

## Publicar en GitHub Pages

1. En GitHub: **Settings → Secrets and variables → Actions → New repository secret** y crea:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` publica la página automáticamente (pestaña **Actions**).
   La dirección será `https://<usuario>.github.io/cafeteria-online/`.

> GitHub Pages gratuito requiere que el repositorio sea público. No hay datos sensibles en el código:
> la `anon key` es pública por diseño y la seguridad la aplican las reglas RLS de la base de datos.

## Estructura

```
src/
  admin/        Panel de administración (productos, secciones, página, login)
  components/   Encabezado, tarjetas, carrito, pie de página, cenefa decorativa
  pages/        Inicio y página de cada producto
  lib/          Datos (Supabase/demo), WhatsApp, ajuste de imágenes, formatos
  data/seed.js  Datos de ejemplo genéricos
supabase/       Esquema, seguridad y datos de ejemplo en SQL
```

## Créditos

Fotos de ejemplo de Unsplash y Pexels: ver [CREDITOS.md](CREDITOS.md).
