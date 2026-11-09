-- =====================================================================
-- Cafetería Online — esquema de base de datos para Supabase
-- Ejecuta este archivo completo en: Supabase > SQL Editor > New query
-- Es seguro ejecutarlo más de una vez.
-- =====================================================================

-- ---------- Administradores ----------
-- Solo los usuarios listados aquí pueden modificar el contenido.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Configuración de la página (una sola fila) ----------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- Secciones del menú ----------
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  prefix text not null unique check (prefix ~ '^[A-Z]{2,4}$'),
  description text not null default '',
  sort int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Productos ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z]{2,4}-[0-9]{3}$'),
  section_id uuid not null references public.sections (id) on delete restrict,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null default '',
  available boolean not null default true,
  featured boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_section_idx on public.products (section_id, sort);

-- ---------- Seguridad (Row Level Security) ----------
alter table public.admins   enable row level security;
alter table public.settings enable row level security;
alter table public.sections enable row level security;
alter table public.products enable row level security;

-- Lectura pública del menú y la configuración
drop policy if exists "lectura publica" on public.settings;
create policy "lectura publica" on public.settings for select using (true);
drop policy if exists "lectura publica" on public.sections;
create policy "lectura publica" on public.sections for select using (true);
drop policy if exists "lectura publica" on public.products;
create policy "lectura publica" on public.products for select using (true);

-- Escritura solo para administradores
drop policy if exists "escritura admin" on public.settings;
create policy "escritura admin" on public.settings for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "escritura admin" on public.sections;
create policy "escritura admin" on public.sections for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "escritura admin" on public.products;
create policy "escritura admin" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- Un admin puede comprobar su propio registro (la tabla no es pública)
drop policy if exists "ver propio registro" on public.admins;
create policy "ver propio registro" on public.admins for select
  using (user_id = auth.uid());

-- ---------- Almacenamiento de imágenes ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes', 'imagenes', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "imagenes subir admin" on storage.objects;
create policy "imagenes subir admin" on storage.objects for insert
  with check (bucket_id = 'imagenes' and public.is_admin());
drop policy if exists "imagenes editar admin" on storage.objects;
create policy "imagenes editar admin" on storage.objects for update
  using (bucket_id = 'imagenes' and public.is_admin());
drop policy if exists "imagenes borrar admin" on storage.objects;
create policy "imagenes borrar admin" on storage.objects for delete
  using (bucket_id = 'imagenes' and public.is_admin());
