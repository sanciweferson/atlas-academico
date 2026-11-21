-- Execute no SQL Editor do projeto Supabase.
create table if not exists public.lesson_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (char_length(lesson_id) between 1 and 100),
  body text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
alter table public.lesson_notes enable row level security;
revoke all on public.lesson_notes from anon;
grant select,insert,update,delete on public.lesson_notes to authenticated;
drop policy if exists "Read own notes" on public.lesson_notes;
create policy "Read own notes" on public.lesson_notes for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "Insert own notes" on public.lesson_notes;
create policy "Insert own notes" on public.lesson_notes for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists "Update own notes" on public.lesson_notes;
create policy "Update own notes" on public.lesson_notes for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "Delete own notes" on public.lesson_notes;
create policy "Delete own notes" on public.lesson_notes for delete to authenticated using ((select auth.uid())=user_id);
create or replace function public.touch_lesson_notes() returns trigger language plpgsql set search_path = '' as $$begin new.updated_at=now();return new;end;$$;
drop trigger if exists trg_touch_lesson_notes on public.lesson_notes;
create trigger trg_touch_lesson_notes before update on public.lesson_notes for each row execute function public.touch_lesson_notes();
