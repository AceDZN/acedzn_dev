export const ANALYTICS_CONSENT_STORAGE_KEY = "workbook_cookie_choice_v1";

export type AnalyticsConsentChoice = "analytics" | "essential";

export function parseAnalyticsConsentChoice(value: string | null) {
  return value === "analytics" || value === "essential" ? value : null;
}

export function readAnalyticsConsentCookie(cookieHeader: string) {
  const prefix = `${ANALYTICS_CONSENT_STORAGE_KEY}=`;
  const value = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);

  return parseAnalyticsConsentChoice(value ?? null);
}

export function readStoredAnalyticsConsent() {
  const cookieChoice = readAnalyticsConsentCookie(document.cookie);
  if (cookieChoice) return cookieChoice;

  try {
    return parseAnalyticsConsentChoice(
      window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}
