# CourseShare

**Every course. Every semester. All in one place.**

CourseShare is an open-source platform where students create course folders and upload semester resources — PDFs, slides, past papers, notes — so the next cohort doesn't have to chase files across WhatsApp groups and broken Drive links.

## Features

- 📁 **Course folders** — create a course with name, code, university, semester, and year
- ⬆️ **Resource uploads** — PDFs, Word, PowerPoint, Excel, TXT, ZIP up to 50 MB
- 🔍 **Full-text search** — search across course names, codes, and universities (Postgres GIN index)
- 🏫 **School filter** — browse courses by university
- 🔐 **Auth** — email/password via Supabase, protected upload routes
- 🚩 **Moderation** — report button on every resource; uploaders can delete their own files

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [Supabase](https://supabase.com) — Postgres, Auth, Storage
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript + Zod

## Getting started

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd courseshare
   npm install
   ```

2. **Set up Supabase**

   Create a project at [supabase.com](https://supabase.com), then run [`supabase-schema.sql`](supabase-schema.sql) in the SQL editor. This creates all tables, row-level security policies, the storage bucket, and the signup trigger.

3. **Environment variables**

   Create `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Run**

   ```bash
   npm run dev
   ```

## Roadmap

- [ ] AI exam prep — chat with your course's uploaded PDFs (RAG over pgvector + Claude API)
- [ ] Upvotes / quality signals on resources
- [ ] In-browser PDF preview
- [ ] Admin moderation dashboard

## Contributing

PRs welcome. This project exists because gathering course materials each semester is a universal student pain — if it saved you time, consider uploading your own notes.

## License

MIT
