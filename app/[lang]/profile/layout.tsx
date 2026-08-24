import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile settings",
  robots: { index: false, follow: false },
};

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { userId } = await auth();
  if (!userId) {
    const returnPath = `/${lang}/profile`;
    redirect(`/${lang}/sign-in?redirect_url=${encodeURIComponent(returnPath)}`);
  }

  return children;
}
