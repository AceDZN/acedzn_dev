"use client";

import posthog, { type BeforeSendFn } from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  Suspense,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import {
  resetPostHogClientPreservingConsent,
  type PostHogIdentityResetClient,
} from "./posthog-consent";
import type { AnalyticsConsentChoice } from "./consent-choice";
import { readEffectiveAnalyticsConsent } from "./analytics-region";

const POSTHOG_PROXY_PATH = "/ingest";
export const ANALYTICS_CONSENT_CHANGED_EVENT =
  "workbook:analytics-consent-changed";
export type AnalyticsConsentChangedEvent = CustomEvent<{
  choice: AnalyticsConsentChoice;
  source?: string;
}>;
const SAFE_ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "source",
] as const;
const SAFE_ATTRIBUTION_VALUE = /^[a-z0-9][a-z0-9_.-]{0,63}$/i;

export function resetPostHogIdentity(posthog: PostHogIdentityResetClient) {
  const restoredConsent = resetPostHogClientPreservingConsent(posthog);

  if (restoredConsent) {
    queueMicrotask(() => {
      window.dispatchEvent(
        new CustomEvent(ANALYTICS_CONSENT_CHANGED_EVENT, {
          detail: { choice: "analytics", source: "identity_reset" },
        }),
      );
    });
  }
}

function getSafeAnalyticsUrl(
  rawUrl: string,
  searchParams?: { get(key: string): string | null } | null,
) {
  const sourceUrl = new URL(rawUrl, window.location.origin);
  const url = new URL(sourceUrl.pathname, sourceUrl.origin);
  for (const key of SAFE_ATTRIBUTION_KEYS) {
    const value = searchParams?.get(key) ?? sourceUrl.searchParams.get(key);
    if (value && SAFE_ATTRIBUTION_VALUE.test(value)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

const sanitizePostHogEvent: BeforeSendFn = (event) => {
  if (!event) return null;

  const properties = { ...event.properties };
  for (const property of ["$current_url", "$referrer"] as const) {
    const value = properties[property];
    if (typeof value !== "string") continue;
    try {
      properties[property] = getSafeAnalyticsUrl(value);
    } catch {
      delete properties[property];
    }
  }

  // Exception messages can include API responses or user-authored content.
  // Preserve the stack/type for grouping while replacing free-form values.
  if (
    event.event === "$exception" &&
    Array.isArray(properties.$exception_list)
  ) {
    properties.$exception_list = properties.$exception_list.map((exception) => {
      if (!exception || typeof exception !== "object") return exception;
      return {
        ...exception,
        value: "Unhandled client error",
      };
    });
  }

  return { ...event, properties };
};

function getPostHogUiHost(host?: string) {
  if (!host) {
    return undefined;
  }

  return host
    .replace("https://us.i.posthog.com", "https://us.posthog.com")
    .replace("https://eu.i.posthog.com", "https://eu.posthog.com");
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const lastPageViewKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const capturePageView = () => {
      if (pathname && posthog?.has_opted_in_capturing()) {
        const currentUrl = getSafeAnalyticsUrl(pathname, searchParams);
        if (lastPageViewKeyRef.current === currentUrl) return;
        lastPageViewKeyRef.current = currentUrl;
        posthog.capture("$pageview", {
          $current_url: currentUrl,
        });
      }
    };

    capturePageView();
    window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, capturePageView);
    return () =>
      window.removeEventListener(
        ANALYTICS_CONSENT_CHANGED_EVENT,
        capturePageView,
      );
  }, [pathname, searchParams, posthog]);

  return null;
}

const isLocalDev =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");
const isWorkbookProductionDomain =
  typeof window !== "undefined" &&
  (window.location.hostname === "workbook.co.il" ||
    window.location.hostname.endsWith(".workbook.co.il"));

if (typeof window !== "undefined" && !isLocalDev) {
  const key =
    process.env.NEXT_PUBLIC_POSTHOG_TOKEN ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const uiHost = getPostHogUiHost(host);

  if (key) {
    const effectiveConsent = readEffectiveAnalyticsConsent();

    posthog.init(key, {
      api_host: POSTHOG_PROXY_PATH,
      ui_host: uiHost,
      defaults: "2026-01-30",
      person_profiles: "identified_only",
      autocapture: true,
      // Workbook activities can render teacher-authored clues, answers, and
      // titles as ordinary element text or attributes. Keep autocapture useful
      // for interaction topology while explicit app events provide stable,
      // aggregate properties for analysis.
      mask_all_text: true,
      mask_all_element_attributes: true,
      // Keep the anonymous/session id continuous while users move between the
      // Workbook, Practice, Dashboard, Dictation, and Generators subdomains.
      // Leave this off on preview/custom domains where a parent-domain cookie
      // would be invalid or could cross an unrelated tenant boundary.
      cross_subdomain_cookie: isWorkbookProductionDomain,
      capture_pageview: false, // Start false, manually capture in page view if needed, or true if we want auto
      capture_pageleave: true, // Enable pageleave capture explicitly since pageview is manual
      capture_performance: {
        network_timing: false,
        web_vitals: true,
        web_vitals_allowed_metrics: ["LCP", "CLS", "FCP", "INP"],
        web_vitals_attribution: false,
      },
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
      enable_recording_console_log: false,
      disable_capture_url_hashes: true,
      before_send: sanitizePostHogEvent,
      // Start conservatively. Immediately after initialization, the regional
      // policy enables Israeli traffic by default or preserves opt-out for
      // consent-required regions and explicit essential-only choices.
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      // A domain-scoped cookie lets one consent choice apply consistently to
      // the public Workbook app family. PostHog migrates the prior localStorage
      // value when this persistence backend changes.
      opt_out_capturing_persistence_type: "cookie",
      consent_persistence_name: "workbook_analytics_consent",
      respect_dnt: true,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "#main-content",
      },
    });

    // Israel does not require the EU-style prior opt-in used elsewhere on the
    // network. Apply the proxy-provided regional default before React effects
    // register page views, while preserving any explicit visitor preference.
    if (effectiveConsent === "analytics") {
      posthog.opt_in_capturing({ captureEventName: false });
    } else {
      posthog.opt_out_capturing();
    }
  }
}

type PostHogProviderProps = {
  children: ReactNode;
  app?: string;
  appFamily?: string;
  productArea?: string;
};

function PostHogAppContext({
  app,
  appFamily,
  productArea,
}: Omit<PostHogProviderProps, "children">) {
  const posthog = usePostHog();

  useLayoutEffect(() => {
    const registerContext = () => {
      if (!app || !posthog.has_opted_in_capturing()) return;
      posthog.register({
        app,
        ...(appFamily ? { app_family: appFamily } : {}),
        ...(productArea ? { product_area: productArea } : {}),
      });
    };

    registerContext();
    window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, registerContext);
    return () =>
      window.removeEventListener(
        ANALYTICS_CONSENT_CHANGED_EVENT,
        registerContext,
      );
  }, [app, appFamily, posthog, productArea]);

  return null;
}

export function PostHogProvider({
  children,
  app,
  appFamily,
  productArea,
}: PostHogProviderProps) {
  return (
    <PHProvider client={posthog}>
      <PostHogAppContext
        app={app}
        appFamily={appFamily}
        productArea={productArea}
      />
      <Suspense>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}

export { usePostHog };
