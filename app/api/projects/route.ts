import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "../../../lib/projects";

const VALID_LANGS = ["en", "he"];

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") || "en";

  if (!VALID_LANGS.includes(lang)) {
    return NextResponse.json(
      { error: "Invalid lang parameter. Must be 'en' or 'he'." },
      { status: 400 },
    );
  }

  const projects = await getAllProjects(lang);
  return NextResponse.json({ projects });
}
