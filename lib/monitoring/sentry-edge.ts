import * as Sentry from "@sentry/nextjs";

interface InitOptions {
  app: string;
}

export function initSentryEdge({ app }: InitOptions) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || process.env.NODE_ENV === "development") return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    initialScope: {
      tags: { app, runtime: "edge" },
    },
  });
}
