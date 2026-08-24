import { withSentryConfig } from "@sentry/nextjs";

const SENTRY_ORG = "acedzn-a9";
const SENTRY_PROJECT = "javascript-nextjs";

function shouldPublishBuildArtifacts() {
  // The SENTRY_AUTH_TOKEN injected by the Sentry Vercel integration is being
  // rejected with "Invalid org token (401)", so sentry-cli retried and failed on
  // every production build across all apps -- roughly 45s of billed build time
  // per build for source maps that never actually uploaded. Publishing is opt-in
  // until the integration is reconnected; set SENTRY_UPLOAD_SOURCEMAPS=1 then.
  if (process.env.SENTRY_UPLOAD_SOURCEMAPS !== "1") {
    return false;
  }

  const hasAuthToken = Boolean(process.env.SENTRY_AUTH_TOKEN?.trim());
  const isNonProductionVercelBuild =
    Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";

  return hasAuthToken && !isNonProductionVercelBuild;
}

export function wrapNextConfig<T extends object>(
  nextConfig: T,
  overrides?: Record<string, unknown>,
): T {
  const publishBuildArtifacts = shouldPublishBuildArtifacts();

  return withSentryConfig(
    nextConfig as Parameters<typeof withSentryConfig>[0],
    {
      org: SENTRY_ORG,
      project: SENTRY_PROJECT,
      sourcemaps: {
        disable: !publishBuildArtifacts,
      },
      release: {
        create: publishBuildArtifacts,
        finalize: publishBuildArtifacts,
      },
      errorHandler: (error) => {
        console.warn(
          `[sentry] Build artifact upload failed; continuing without source maps: ${error.message}`,
        );
      },
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      silent: !process.env.CI,
      ...overrides,
    },
  ) as unknown as T;
}
