# Medical Appointment Platform

A modern telehealth and appointment-booking platform built with Next.js, Supabase, Prisma, and Twilio. The application supports patients, doctors, and administrators through dedicated workflows for account management, doctor verification, scheduling, appointment tracking, and secure video consultations.

## About

This project is designed to streamline the end-to-end healthcare booking experience. Patients can discover doctors, reserve consultation slots, and join online appointments. Doctors can manage availability, review appointments, and conduct video sessions. Administrators can supervise doctor onboarding and platform operations through role-based flows.

The codebase uses the Next.js App Router and TypeScript, with Supabase handling authentication and Prisma managing application data in PostgreSQL.

## Features

- Role-based experience for patients, doctors, and admins
- Supabase authentication with login, signup, password recovery, and account confirmation flows
- Doctor onboarding with verification status handling
- Doctor directory with specialty-based browsing
- Availability management for appointment slot creation
- Appointment booking and appointment status tracking
- Twilio-powered video consultation flow for doctor and patient sessions
- Admin dashboard for reviewing and managing doctors
- Responsive UI built with Tailwind CSS and Radix UI primitives
- Form validation using React Hook Form and Zod

## Tech Stack

| Category | Technologies |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Authentication | Supabase SSR, Supabase Auth |
| Database | PostgreSQL, Prisma |
| Video | Twilio Video |
| UI | Tailwind CSS, Radix UI, Lucide Icons |
| Forms & Validation | React Hook Form, Zod |
| Notifications | React Hot Toast, Sonner |
| Tooling | ESLint, PostCSS |

## Project Structure

```text
with-supabase-app/
|-- app/                # App Router pages, layouts, and route groups
|-- actions/            # Server actions for admin, doctor, patient, and video workflows
|-- components/         # Shared UI and feature components
|-- hooks/              # Custom React hooks
|-- lib/                # App utilities, Supabase clients, Prisma client, schemas, Twilio helpers
|-- prisma/             # Prisma schema and migrations
|-- public/             # Static assets
|-- middleware.ts       # App middleware entrypoint
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- A Supabase project
- A PostgreSQL database
- A Twilio account with Video enabled

### Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd with-supabase-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a local environment file:

```bash
cp .env.local.example .env.local
```

If you do not maintain an example file yet, create `.env.local` manually and add the required variables below.

4. Configure environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
DATABASE_URL=
DIRECT_URL=
TWILIO_ACCOUNT_SID=
TWILIO_API_KEY_SID=
TWILIO_API_KEY_SECRET=
```

5. Generate the Prisma client and apply your database changes:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Core Workflows

### Patient

- Create an account and authenticate
- Browse doctors by specialty
- Book appointments from available slots
- Join scheduled video consultations
- Review appointment information

### Doctor

- Register and complete profile details
- Wait for admin verification
- Publish availability slots
- Review booked appointments
- Join live consultation sessions

### Admin

- Review pending doctor registrations
- Approve or reject verification requests
- Monitor doctor-related platform activity



## Roadmap Ideas

- Patient search filters and sorting improvements
- Calendar integrations and reminders
- Consultation notes and post-visit summaries
- Payment processing for paid appointments
- Analytics and reporting for administrators


