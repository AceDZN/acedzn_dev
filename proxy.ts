import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

const locales = ["en", "he"];
const defaultLocale = "en";

const COOKIE_NAME = "NEXT_LOCALE";

// Create a matcher for public routes including the localized ones
// Create a matcher for public routes including the localized ones
const isPublicRoute = createRouteMatcher([
  "/:locale",
  "/",
  "/:locale/(.*)",
  "/api/(.*)",
]);

function getLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check headers
  const headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export const proxy = clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;

    // API routes are locale-neutral and already have their own route handlers.
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    if (pathnameHasLocale) {
      // If it has a locale, proceed with Clerk protection if needed
      if (!isPublicRoute(req)) {
        await auth.protect();
      }
      const pathLocale = pathname.split("/")[1] ?? defaultLocale;
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-locale", pathLocale);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Redirect if there is no locale
    const locale = getLocale(req);
    req.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(req.nextUrl);
  },
  {
    // Explicitly set the domain to share cookies across subdomains (e.g. docs.acedzn.dev)
    domain:
      process.env.CLERK_COOKIE_DOMAIN ||
      (process.env.NODE_ENV === "production" ? "acedzn.dev" : undefined),
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|ingest|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|glb|gltf|xml|txt)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
