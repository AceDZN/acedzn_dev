import type { PostHog } from "posthog-js";

export type PostHogIdentityResetClient = Pick<
  PostHog,
  "has_opted_in_capturing" | "opt_in_capturing" | "reset"
>;

/**
 * PostHog reset() clears consent along with identity and persistence. Restore an
 * existing analytics choice after the reset so signing out does not silently
 * disable capture when opt_out_capturing_by_default is enabled.
 */
export function resetPostHogClientPreservingConsent(
  posthog: PostHogIdentityResetClient,
) {
  const hadAnalyticsConsent = posthog.has_opted_in_capturing();

  posthog.reset();

  if (hadAnalyticsConsent) {
    posthog.opt_in_capturing({ captureEventName: false });
  }

  return hadAnalyticsConsent;
}
