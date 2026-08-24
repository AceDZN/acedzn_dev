import {
  type AnalyticsConsentChoice,
  readStoredAnalyticsConsent,
} from "./consent-choice";

export const ANALYTICS_REGION_POLICY_COOKIE =
  "workbook_analytics_region_policy_v1";

export type AnalyticsRegionPolicy = "analytics_by_default" | "consent_required";

type RegionRequest = {
  headers: { get(name: string): string | null };
  nextUrl: { hostname: string };
};

type RegionResponse = {
  cookies: {
    set(
      name: string,
      value: string,
      options: {
        domain?: string;
        maxAge: number;
        path: string;
        sameSite: "lax";
        secure: boolean;
      },
    ): unknown;
  };
};

export function isWorkbookProductionHostname(hostname: string) {
  return hostname === "workbook.co.il" || hostname.endsWith(".workbook.co.il");
}

export function getAnalyticsRegionPolicy(countryCode: string | null) {
  return countryCode?.toUpperCase() === "IL"
    ? ("analytics_by_default" as const)
    : ("consent_required" as const);
}

export function readAnalyticsRegionPolicy(cookieHeader: string) {
  const prefix = `${ANALYTICS_REGION_POLICY_COOKIE}=`;
  const value = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);

  return value === "analytics_by_default" || value === "consent_required"
    ? value
    : null;
}

export function resolveAnalyticsConsent(
  hostname: string,
  explicitChoice: AnalyticsConsentChoice | null,
  regionPolicy: AnalyticsRegionPolicy | null,
) {
  if (explicitChoice) return explicitChoice;
  if (
    isWorkbookProductionHostname(hostname) &&
    regionPolicy === "analytics_by_default"
  ) {
    return "analytics" as const;
  }
  return null;
}

export function readEffectiveAnalyticsConsent() {
  return resolveAnalyticsConsent(
    window.location.hostname,
    readStoredAnalyticsConsent(),
    readAnalyticsRegionPolicy(document.cookie),
  );
}

export function applyAnalyticsRegionCookie<ResponseType extends RegionResponse>(
  request: RegionRequest,
  response: ResponseType,
) {
  const hostname = request.nextUrl.hostname;
  const workbookProduction = isWorkbookProductionHostname(hostname);
  const policy = getAnalyticsRegionPolicy(
    request.headers.get("x-vercel-ip-country"),
  );

  response.cookies.set(ANALYTICS_REGION_POLICY_COOKIE, policy, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    secure: workbookProduction,
    ...(workbookProduction ? { domain: ".workbook.co.il" } : {}),
  });

  return response;
}
