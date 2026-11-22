-- Atlas Acadêmico: executar uma vez no SQL Editor do Supabase.
-- Não substitui o schema.sql existente de anotações.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select, insert, update, delete on public.profiles to authenticated;

drop policy if exists "Profiles select own" on public.profiles;
create policy "Profiles select own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Profiles insert own" on public.profiles;
create policy "Profiles insert own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Profiles update own" on public.profiles;
create policy "Profiles update own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create or replace function public.atlas_new_user_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_atlas_auth_user_created on auth.users;
create trigger on_atlas_auth_user_created after insert on auth.users
for each row execute function public.atlas_new_user_profile();

insert into public.profiles (id, full_name)
select id, left(coalesce(raw_user_meta_data ->> 'full_name', ''), 120) from auth.users
on conflict (id) do nothing;

create or replace function public.atlas_profile_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists on_atlas_profile_updated on public.profiles;
create trigger on_atlas_profile_updated before update on public.profiles
for each row execute function public.atlas_profile_updated_at();

-- Bucket privado: fotos acessíveis somente ao usuário autenticado.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 2097152,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Atlas avatars read own" on storage.objects;
create policy "Atlas avatars read own" on storage.objects for select to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Atlas avatars insert own" on storage.objects;
create policy "Atlas avatars insert own" on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Atlas avatars delete own" on storage.objects;
create policy "Atlas avatars delete own" on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
