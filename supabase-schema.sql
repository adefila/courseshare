-- ============================================================
-- CourseShare — Supabase Schema
-- Paste this into the Supabase SQL editor and run it.
-- ============================================================


-- 1. Profiles (auto-created on signup via trigger below)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table profiles enable row level security;

create policy "Public profiles are readable by everyone"
  on profiles for select using (true);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);


-- 2. Courses
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references profiles(id) on delete set null,
  course_name text not null,
  course_code text not null,
  university text not null,
  semester text not null,
  year int not null,
  description text,
  created_at timestamptz default now() not null,
  -- Full-text search column (auto-maintained)
  fts tsvector generated always as (
    to_tsvector('english',
      coalesce(course_name, '') || ' ' ||
      coalesce(course_code, '') || ' ' ||
      coalesce(university, '')
    )
  ) stored
);

create index if not exists courses_fts_idx on courses using gin(fts);
create index if not exists courses_created_at_idx on courses(created_at desc);

alter table courses enable row level security;

create policy "Anyone can read courses"
  on courses for select using (true);

create policy "Authenticated users can create courses"
  on courses for insert with check (auth.uid() is not null);

create policy "Creators can update their own courses"
  on courses for update using (auth.uid() = created_by);


-- 3. Resources
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade not null,
  uploaded_by uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  file_path text not null,   -- Storage object key: {courseId}/{resourceId}/{fileName}
  file_size_bytes bigint,
  file_type text,
  is_removed boolean default false not null,
  created_at timestamptz default now() not null
);

create index if not exists resources_course_id_idx on resources(course_id);

alter table resources enable row level security;

create policy "Anyone can read non-removed resources"
  on resources for select using (is_removed = false);

create policy "Authenticated users can upload resources"
  on resources for insert with check (auth.uid() is not null);

create policy "Uploaders can update their own resources"
  on resources for update using (auth.uid() = uploaded_by);

create policy "Uploaders can delete their own resources"
  on resources for delete using (auth.uid() = uploaded_by);


-- 4. Reports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade,
  reported_by uuid references auth.users(id) on delete set null,
  reason text,
  created_at timestamptz default now() not null
);

alter table reports enable row level security;

create policy "Authenticated users can submit reports"
  on reports for insert with check (auth.uid() is not null);


-- 5. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- Storage setup (run after creating the bucket in the UI)
-- ============================================================
-- In Supabase Dashboard:
--   Storage > New bucket > name: "resources" > Private bucket > Create
--
-- Then run these storage policies:

insert into storage.buckets (id, name, public, file_size_limit)
values ('resources', 'resources', false, 52428800)  -- 50 MB
on conflict (id) do nothing;

create policy "Authenticated users can upload to resources bucket"
  on storage.objects for insert
  with check (bucket_id = 'resources' and auth.uid() is not null);

create policy "Anyone can read resource objects"
  on storage.objects for select
  using (bucket_id = 'resources');

create policy "Uploaders can delete their own resource objects"
  on storage.objects for delete
  using (
    bucket_id = 'resources'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
