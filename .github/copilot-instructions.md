### Repo: software_project — Copilot instructions for code edits

This project is a Next.js (App Router) application using Supabase for auth and Prisma for the database. The guidance below focuses on concrete patterns and locations an AI coding agent should know to be immediately productive.

- Architecture: Next + Supabase + Prisma
  - App router lives in `app/`. UI and route components use React Server Components by default; client components are marked with `"use client"` (see `components/login-form.tsx`).
  - Authentication/session middleware: `middleware.ts` delegates to `lib/supabase/middleware.ts`. Follow that file when changing auth/redirect behavior.
  - Supabase usage:
    - Server-side: use `lib/supabase/server.ts` → `createServerClient()` per-request. Do NOT create a long-lived global server client.
    - Browser/client: use `lib/supabase/client.ts` → `createBrowserClient()` inside client components only.
    - Middleware cookie pattern: `lib/supabase/middleware.ts` sets cookies on a `NextResponse` and returns that response. If creating a new `NextResponse`, copy cookies from the middleware response (see comments in file).
  - Database: `prisma/schema.prisma` (Postgres). Environment variables required: `DATABASE_URL` and `DIRECT_URL` for Prisma pooling/direct connections.

- Key files to check when making changes
  - `middleware.ts` — central auth gate for most routes. Changing redirects or cookie handling must consider `updateSession` in `lib/supabase/middleware.ts`.
  - `lib/supabase/*` — client, server, middleware helpers for Supabase integration.
  - `prisma/schema.prisma` — schema and datasource configuration.
  - `app/protected/` — example of authenticated routes.
  - `components/*.tsx` — small, focused UI components (e.g., `components/login-form.tsx` demonstrates sign-in flow and client-side `createClient()` usage).

- Environment variables and runtime notes
  - Required for full behavior: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `DIRECT_URL`.
  - If env vars are missing the middleware skips auth checks (see `lib/supabase/middleware.ts`). Tests or local development may rely on this fallback.
  - Next dev runs with Turbopack in `package.json`: `npm run dev` → `next dev --turbopack`.

- Conventions and patterns to follow
  - Prefer per-request server clients for Supabase (do not hoist `createServerClient` to module scope).
  - Keep UI/state logic inside `components/` and use `"use client"` at the top of files that need hooks or browser APIs.
  - Redirects and auth enforcement are centralized in `middleware.ts`. Avoid duplicating redirect checks in individual pages unless necessary.
  - When altering middleware that modifies cookies, follow the in-file comment: always return the original `supabaseResponse` or copy cookies into any new `NextResponse` you return.

- Example snippets (follow these patterns)
  - Client sign-in (from `components/login-form.tsx`):
    - Use `createClient()` from `lib/supabase/client.ts`, call `supabase.auth.signInWithPassword(...)`, then redirect with `next/navigation` router.
  - Server usage in server components / route handlers:
    - Call the `createClient()` from `lib/supabase/server.ts` inside the function — do not cache it globally.

- Developer workflows / commands
  - Start dev server: `npm run dev` (uses turbopack)
  - Build: `npm run build`
  - Start production server: `npm run start`
  - Lint: `npm run lint`
  - Prisma migrations (standard):
    - `npx prisma migrate dev` (local development)
    - `npx prisma generate` (after changing schema)

- Integration and areas to be cautious about
  - Supabase cookie syncing is fragile: changing cookie logic without preserving the response cookies will cause session desyncs and random logouts.
  - The project targets Next's App Router and React 18+/19 features — avoid mixing legacy `pages/` patterns.
  - Be careful modifying `next.config.ts` and middleware matcher patterns; those affect which routes are protected.

- Next steps
  - If you want, I can add examples for Prisma migrations, or a short checklist for changing auth/middleware code safely.

If anything here is unclear or you want me to expand a section (examples for Prisma, more component examples, or tests), tell me which area to iterate on.
