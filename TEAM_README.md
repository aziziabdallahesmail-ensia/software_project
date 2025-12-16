# Medical Appointment System - Developer Guide

A Next.js 16 application for managing doctor-patient appointments with Supabase authentication and Prisma ORM.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Auth:** Supabase (SSR)
- **Database:** PostgreSQL via Prisma ORM
- **UI:** Radix UI components, Lucide icons
- **Forms:** React Hook Form + Zod form validation

---

## Project Structure

```
├── actions/           # Server Actions (business logic)
├── app/               # Next.js App Router pages
├── components/        # Reusable React components
├── hooks/             # Custom React hooks
├── lib/               # Utilities & configurations
├── prisma/            # Database schema
```

---

## User Roles

| Role       | Description                                      |
|------------|--------------------------------------------------|
| `unassigned` | New users who haven't selected a role          |
| `patient`    | Can search doctors and book appointments       |
| `doctor`     | Must be verified to appear in search results   |
| `admin`      | Manages doctor verifications and system config |

---

## Key Files Explained

### `/actions/` - Server Actions

| File          | Purpose                                                     |
|---------------|-------------------------------------------------------------|
| `admin.ts`    | Admin-only: approve/reject doctors, manage verifications    |
| `doctor.ts`   | Doctor profile, availability slots, appointment management  |
| `patient.ts`  | Search doctors, view slots, book/cancel appointments        |
| `set_user_role.ts` | Assigns role to new users after registration           |

### `/app/` - Routes

| Route                     | Description                          |
|---------------------------|--------------------------------------|
| `/`                       | Landing page                         |
| `/auth/*`                 | Login, sign-up, password reset       |
| `/role_selection`         | New users choose patient/doctor role |
| `/doctor`                 | Doctor dashboard                     |
| `/doctor/still-in-verification` | Pending verification page      |
| `/doctors`                | Public doctor listing                |
| `/appointments`           | Appointment management               |
| `/admin`                  | Admin dashboard                      |
| `/admin/pending-verification` | Review pending doctors          |
| `/protected`              | Authenticated user area              |

### `/lib/` - Utilities

| File              | Purpose                                          |
|-------------------|--------------------------------------------------|
| `prisma.ts`       | Prisma client singleton                          |
| `check_user.ts`   | Get current user + profile from DB               |
| `supabase/client.ts` | Browser Supabase client                       |
| `supabase/server.ts` | Server Supabase client                        |
| `supabase/middleware.ts` | Auth session refresh & route protection  |
| `schema.ts`       | Zod validation schemas                           |
| `specialities.ts` | List of medical specialties                      |

### `/components/`

| Folder   | Contents                                   |
|----------|--------------------------------------------|
| `ui/`    | Base components (Button, Card, Input, etc) |
| `admin/` | Admin-specific components                  |
| Root     | Auth forms, layout components              |

---

## Database Models (Prisma)

```
Profile          # Users (patients, doctors, admins)
├── Availability # Doctor time slots
└── Appointment  # Bookings between patient & doctor
```

**Key fields on Profile:**
- `role`: UserRole enum
- `verificationStatus`: pending | verified | rejected (for doctors)
- `isActive`, `isFeatured`: Doctor visibility flags

---

## Auth Flow

1. User signs up → Supabase creates auth user
2. Supabase trigger creates `Profile` with `role: unassigned`
3. User redirected to `/role_selection`
4. User picks role → `set_user_role` action updates profile
5. If doctor → must submit credentials → admin approves

---

## Doctor Verification Flow

```
Doctor submits credentials
    ↓
verificationStatus = "pending"
    ↓
Admin reviews at 
    ↓
Admin approves → verificationStatus = "verified"
    ↓
Doctor appears in patient search results
```

---

## Middleware (`middleware.ts`)

Runs on every request to:
- Refresh Supabase auth session
- Redirect unauthenticated users to `/auth/login`
- Excludes: `/`, `/auth/*`, static files

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate


# Run development server
npm run dev
```
## Next.js Routing Basics

Next.js uses **file-based routing** inside the `app/` folder:

| File/Folder Pattern | Result |
|---------------------|--------|
| `app/page.tsx` | Route: `/` |
| `app/about/page.tsx` | Route: `/about` |
| `app/doctors/[id]/page.tsx` | Dynamic route: `/doctors/123` |
| `app/(index)/doctors/page.tsx` | Route: `/doctors` (group ignored in URL) |
| `app/api/test/route.ts` | API endpoint: `/api/test` |

**Special Files:**
- `page.tsx` — Makes folder a route
- `layout.tsx` — Shared UI wrapper (persists across child routes)
- `loading.tsx` — Loading state
- `error.tsx` — Error boundary
- `route.ts` — API route handler

**Route Groups:** Folders wrapped in `()` like `(index)` organize code without affecting the URL.

**Example in this project:**
```
app/(index)/doctors/page.tsx  →  /doctors
app/(index)/doctor/page.tsx   →  /doctor
app/admin/page.tsx            →  /admin
```

---

## API Test Routes

For development testing:
- `/api/test-admin-actions`
- `/api/test-doctor-actions`
- `/api/test-patient-actions`



---


#  Tasks
