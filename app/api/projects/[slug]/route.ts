import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "../../../../lib/projects";

const VALID_LANGS = ["en", "he"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const lang = request.nextUrl.searchParams.get("lang") || "en";

  if (!VALID_LANGS.includes(lang)) {
    return NextResponse.json(
      { error: "Invalid lang parameter. Must be 'en' or 'he'." },
      { status: 400 },
    );
  }

  const project = await getProjectBySlug(slug, lang);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}
