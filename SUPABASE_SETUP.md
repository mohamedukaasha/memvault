# Supabase Setup Guide

To enable real uploading functionality, you need to set up a Supabase project.

## 1. Create a Project
Go to [Supabase](https://supabase.com/) and create a new project.

## 2. Get Credentials
1. Go to **Settings** -> **API**.
2. Copy the **Project URL** and **anon public key**.
3. Create a `.env` file in the root of your project (or rename `.env.example` if it exists) and add:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Create Storage Bucket
1. Go to **Storage**.
2. Create a new bucket named `memories`.
3. Make it **Public**.
4. Add a policy to allow authenticated/anon users to upload:
   - SELECT (read): true (public)
   - INSERT (upload): true (anon/authenticated)

## 4. Create Database Table
Go to the **SQL Editor** and run the following script to create the `memories` table:

```sql
-- Memories Table
create table public.memories (
  id uuid primary key,
  title text not null,
  description text,
  media_type text check (media_type in ('photo', 'video')),
  media_url text not null,
  thumbnail_url text,
  event_category text,
  grade text,
  school_year text,
  uploaded_by text,
  uploaded_at timestamp with time zone default now(),
  status text default 'approved',
  likes integer default 0,
  tags text[],
  album_id uuid -- Optional link to album
);

-- Albums Table
create table public.albums (
  id uuid primary key,
  name text not null,
  description text,
  cover_url text,
  created_by text,
  created_at timestamp with time zone default now(),
  is_public boolean default true,
  item_count integer default 0
);

-- Enable RLS
alter table public.memories enable row level security;
alter table public.albums enable row level security;

-- Memories Policies
create policy "Allow public inserts" on public.memories for insert with check (true);
create policy "Allow public read" on public.memories for select using (true);
create policy "Allow public updates" on public.memories for update using (true);
create policy "Allow public deletes" on public.memories for delete using (true);

-- Albums Policies
create policy "Allow public albums insert" on public.albums for insert with check (true);
create policy "Allow public albums read" on public.albums for select using (true);
create policy "Allow public albums update" on public.albums for update using (true);
create policy "Allow public albums delete" on public.albums for delete using (true);

-- Storage Policies
-- Note: Make sure the 'memories' bucket is created first.
-- Allow public to select files
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'memories' );
-- Allow anyone to upload
-- create policy "Any Upload" on storage.objects for insert with check ( bucket_id = 'memories' );
```

