create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 2),
  email text not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message text not null check (char_length(message) >= 10),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Allow anonymous contact submissions"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

grant insert on public.contact_messages to anon, authenticated;
