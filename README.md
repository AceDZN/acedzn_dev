# AceDZN.dev

Standalone Next.js app for the AceDZN portfolio and public project directory.
It was migrated from `acedzn-tools/apps/web`; shared monorepo packages used by
the app now live under `components/` and `lib/`.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The root URL redirects to
the preferred locale. Localized routes live under `app/[lang]` and support
English (`en`) and Hebrew (`he`).

The app expects Clerk, Convex, PostHog, and Sentry environment variables in
`.env.local`. The migrated local environment file is gitignored.

## Checks

```bash
pnpm check-types
pnpm lint
pnpm build
```
