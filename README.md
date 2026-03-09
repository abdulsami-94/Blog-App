# Blog App

A production-ready blog built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **MDX**, **Prisma**, and **NextAuth.js v5**.

## Setup

1. **Install dependencies** (already done if you cloned with node_modules):
   ```bash
   npm install
   ```

2. **Environment variables**  
   Copy `.env.example` to `.env.local` and fill in values:
   ```bash
   cp .env.example .env.local
   ```
   - `DATABASE_URL` — SQLite: `file:./dev.db` (or PostgreSQL URL for production)
   - `AUTH_SECRET` — Generate with: `openssl rand -base64 32`
   - `AUTH_URL` — Your app URL (e.g. `http://localhost:3000`)
   - Optional: `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` for GitHub login
   - `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_APP_NAME` for SEO and links

3. **Database**  
   Migrations are already applied if you ran them. Otherwise:
   ```bash
   npx prisma migrate dev
   ```

4. **Run the app**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run test` — Run Vitest tests

## Features

- **Homepage** — Featured post, recent posts, newsletter signup, tag cloud
- **Blog** — Paginated index, tag filter, sort by latest/oldest/views
- **Posts** — MDX with syntax highlighting, TOC, reading progress, share, related posts, comments
- **Search** — Client-side search (Cmd/Ctrl+K)
- **Auth** — Credentials + GitHub (optional), protected dashboard
- **Dashboard** — Create/edit/delete posts, view counts, profile
- **Newsletter** — Email signup with duplicate check
- **SEO** — Metadata, OG images, JSON-LD, sitemap, robots
- **Dark mode** — System preference + manual toggle, no flash

## Create an account

1. Go to **Register** and sign up with email/password.
2. Log in and open **Dashboard** to create posts.

## Tech stack

- Next.js 16 (App Router), TypeScript (strict), Tailwind CSS v4
- next-mdx-remote, rehype-pretty-code, gray-matter, date-fns
- Prisma (SQLite dev / PostgreSQL prod), NextAuth.js v5
- React Hook Form, Zod, Lucide React
