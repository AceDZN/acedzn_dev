import {
  captureRouterTransitionStart,
  initSentryClient,
} from "@/lib/monitoring/sentry-client";

initSentryClient({ app: "web" });

export const onRouterTransitionStart = captureRouterTransitionStart;
