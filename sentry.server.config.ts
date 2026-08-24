import { initSentryServer } from "@/lib/monitoring/sentry-server";

initSentryServer({ app: "web" });
