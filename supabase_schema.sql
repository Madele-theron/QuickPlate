-- Create profiles table (links to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create preferences table
create table public.preferences (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create pantry_items table
create table public.pantry_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  normalized_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create recipes table
create table public.recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  recipe_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_threads table
create table public.chat_threads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_messages table
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references public.chat_threads(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- SET UP ROW LEVEL SECURITY (RLS)

alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.pantry_items enable row level security;
alter table public.recipes enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles policies
create policy "Users can view own profile." on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert own profile." on public.profiles
  for insert with check (auth.uid() = id);

-- Preferences policies
create policy "Users can select own preferences." on public.preferences
  for select using (auth.uid() = user_id);

create policy "Users can insert own preferences." on public.preferences
  for insert with check (auth.uid() = user_id);

create policy "Users can update own preferences." on public.preferences
  for update using (auth.uid() = user_id);

-- Pantry items policies
create policy "Users can select own pantry items." on public.pantry_items
  for select using (auth.uid() = user_id);

create policy "Users can insert own pantry items." on public.pantry_items
  for insert with check (auth.uid() = user_id);

create policy "Users can update own pantry items." on public.pantry_items
  for update using (auth.uid() = user_id);

create policy "Users can delete own pantry items." on public.pantry_items
  for delete using (auth.uid() = user_id);

-- Recipes policies
create policy "Users can select own recipes." on public.recipes
  for select using (auth.uid() = user_id);

create policy "Users can insert own recipes." on public.recipes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own recipes." on public.recipes
  for update using (auth.uid() = user_id);

create policy "Users can delete own recipes." on public.recipes
  for delete using (auth.uid() = user_id);

-- Chat threads policies
create policy "Users can select own chat threads." on public.chat_threads
  for select using (auth.uid() = user_id);

create policy "Users can insert own chat threads." on public.chat_threads
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own chat threads." on public.chat_threads
  for delete using (auth.uid() = user_id);

-- Chat messages policies
-- (Users can view messages if they own the thread)
create policy "Users can select own messages." on public.chat_messages
  for select using (
    exists (
      select 1 from public.chat_threads
      where chat_threads.id = chat_messages.thread_id
      and chat_threads.user_id = auth.uid()
    )
  );

create policy "Users can insert own messages." on public.chat_messages
  for insert with check (
    exists (
      select 1 from public.chat_threads
      where chat_threads.id = chat_messages.thread_id
      and chat_threads.user_id = auth.uid()
    )
  );


-- FUNCTION TO AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  
  -- also create an empty preferences row manually 
  insert into public.preferences (user_id, data)
  values (new.id, '{}'::jsonb);

  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER FOR NEW USER
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
