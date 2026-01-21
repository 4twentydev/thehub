# Dashboard Hub (4twenty.dev)

A production-ready Next.js dashboard hub for tracking projects, dependencies, tools, services, and operational checklists. Built for public read-only discovery with private owner mode powered by Auth.js v2.

## Stack
- Next.js App Router (Next 16 canary)
- React 19
- Tailwind CSS v4 + shadcn/ui
- Framer Motion
- Neon Postgres + Drizzle ORM
- Auth.js v2 (NextAuth v5 beta)
- Bun

## Setup
```bash
bun install
```

### Environment Variables
Create a `.env` file (or configure Vercel env vars):

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST/db
AUTH_SECRET=replace-with-long-random-string
OWNER_PINS=1234,5678
VERCEL_BLOB_READ_WRITE_TOKEN=optional
```

- `DATABASE_URL`: Neon Postgres connection string.
- `AUTH_SECRET`: Auth.js secret.
- `OWNER_PINS`: Comma-separated list of allowed admin PINs.
- `VERCEL_BLOB_READ_WRITE_TOKEN`: Only needed when you wire up blob uploads.

## Drizzle + Neon
```bash
bun run db:generate
bun run db:migrate
bun run db:seed
```

## Auth.js (Owner Mode)
- Uses Credentials provider with PINs.
- Multiple admins supported via `OWNER_PINS`.
- Login screen lives at `/login`.

## Scripts
```bash
bun dev
bun run build
bun run start
bun run lint
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
bun run db:seed
```

## Deploy (Vercel)
1. Set env vars in Vercel.
2. Ensure Neon database is reachable.
3. Deploy.

## Notes
- Public routes: `/`, `/projects`, `/projects/[slug]`.
- Owner routes: `/admin` and `/admin/*` require login.
- Seed data includes six projects and sample dependencies/tools.
