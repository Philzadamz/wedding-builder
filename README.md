# Velvet — Wedding Website Builder

A self-serve wedding e-invite website builder. Couples create a beautiful, personalised wedding website in under 30 minutes.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Auth & Database**: Supabase (Postgres + Row Level Security)
- **Storage**: Supabase Storage (`wedding-assets` bucket)
- **Styling**: Tailwind CSS v4 + custom CSS variables
- **Fonts**: Cormorant Garamond (display), Jost (body), Great Vibes (script) via Google Fonts

## Getting Started

### 1. Clone & install

```bash
cd wedding-builder
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL** and **anon key** from Settings → API
3. Copy your **service role key** (keep this secret)

### 3. Set environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the database migration

In your Supabase project → SQL Editor, paste and run the contents of:

```
supabase/migrations/001_initial.sql
```

This creates all tables, Row Level Security policies, and the `wedding-assets` storage bucket.

### 5. Enable Google OAuth (optional)

In Supabase → Authentication → Providers → Google, enable and add your OAuth credentials.

### 6. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
  app/
    (auth)/login|signup/    # Auth pages
    (dashboard)/
      setup/                # 7-step setup wizard
      dashboard/            # Admin dashboard
    [slug]/                 # Public guest-facing wedding site
    auth/callback/          # Supabase OAuth callback
  components/
    builder/steps/          # Wizard steps (Hero, Schedule, RSVP, Gifting, Wishes, Q&A, Branding)
    guest/                  # Guest-facing section components
    dashboard/              # Admin dashboard tabs
    ui/                     # Design system components (Button, Input, Dialog, etc.)
  lib/
    supabase/               # Client + server Supabase factories
    types/                  # TypeScript types + Database schema type
    utils.ts                # cn(), slugify(), formatDate()
  proxy.ts                  # Auth route guard (Next.js 16)
supabase/
  migrations/001_initial.sql
```

## Features Built

- [x] Sign up / Sign in (email + Google OAuth)
- [x] 2-step onboarding (credentials → couple names + slug)
- [x] 7-step setup wizard (Hero, Schedule, RSVP, Gifting, Well Wishes, Q&A, Branding)
- [x] Live hero image upload to Supabase Storage
- [x] Countdown timer (D/H/M/S)
- [x] Guest site at `/:slug` with all sections
- [x] RSVP form submission → stored in Supabase
- [x] Well Wishes with moderation queue
- [x] Admin dashboard: analytics, RSVP table (CSV export), wishes moderation, share tools
- [x] QR code generation + WhatsApp share
- [x] Open Graph / Twitter card meta tags
- [x] Row Level Security on all tables
- [x] Mobile-responsive, editorial layout
- [x] Accent colour picker + font style selector

## V2 Roadmap

- [ ] Music / background audio
- [ ] Photo gallery (pre-wedding + guest uploads)
- [ ] Guest list CSV import with personalised RSVP links
- [ ] Password-protected sites
- [ ] Multi-language support
- [ ] Printable QR invitation card
- [ ] Email notifications via Resend on each RSVP
