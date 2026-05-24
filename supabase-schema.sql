-- Table des tâches pour l'assistant perso
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Activer RLS
alter table tasks enable row level security;

-- Politique permissive pour commencer (sans auth)
create policy "Allow all" on tasks
  for all using (true) with check (true);
