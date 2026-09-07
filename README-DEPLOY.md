# Deploying Matsika Protective Services website (merged design)

This is a Next.js 16 app using Postgres (via Drizzle ORM) for the candidate
database, admin login, leads/enquiries, and vacancies.

## What's in this build
- Base: Design 1 (fuller public site — Sectors, Legal, Vacancies, Leads/Quote form, Apply wizard)
- Added from Design 2: multi-branch office listing on the Contact page

## Before going live — action items
1. **Images are missing from both source exports.** `public/images/` needs:
   - `logo.png` — your logo (referenced in the site header/admin header)
   - `hero.jpg` — homepage hero background
   Add your real files there (any reasonably sized JPG/PNG works; Next.js will optimize them).
2. **Company details** in `src/lib/constants.ts` (phone numbers, emergency
   number, address, PSIRA reg. number) are placeholder/demo data — update them.
3. **Admin login** — check `src/db/seed.ts` for the seeded admin username/password
   and change it before launch.

## Deploy steps (GitHub + Netlify)
1. Push this folder to a new GitHub repository.
2. In Netlify: "Add new site" → "Import an existing project" → pick that repo.
   Netlify auto-detects Next.js — no build settings needed.
3. Create a Postgres database — easiest option is Netlify DB (built on Neon):
   in your Netlify site, go to the "DB" / Extensions tab and provision one.
   Otherwise use Neon, Supabase, or Railway and copy the connection string.
4. In Netlify → Site settings → Environment variables, add:
   - `DATABASE_URL` = your Postgres connection string
   - `SESSION_SECRET` = a random string (`openssl rand -base64 32`)
5. Run the database migrations/seed once against that DATABASE_URL:
   `npx drizzle-kit push` then `npx tsx src/db/seed.ts` (adjust if seed script differs)
6. Trigger a deploy. Once live, connect your custom domain under
   Site settings → Domain management.
