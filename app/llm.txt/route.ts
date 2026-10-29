import { NextResponse } from "next/server";
import { getCv } from "../../lib/cv";

export async function GET() {
  const cv = await getCv();

  const experience = cv.experience
    .map((job) => {
      const roles = job.roles
        .map(
          (role) =>
            `#### ${role.title} (${role.start} - ${role.end})\n\n` +
            role.highlights.map((h) => `- ${h}`).join("\n"),
        )
        .join("\n\n");
      return `### ${job.company}, ${job.location} (${job.start} - ${job.end})\n\n${roles}`;
    })
    .join("\n\n");

  const content = `
# AceDZN Tools

AceDZN Tools is a collection of developer-focused utilities.

## Tools Available

- JSON Formatter
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- UUID Generator

## Structure

- /: Home page
- /en: English version
- /he: Hebrew version
- /en/cv: Alex Sindalovsky's CV

## About ${cv.name}

${cv.headline}
${cv.location} | ${cv.email} | ${cv.linkedin}

${cv.summary}

### Skills

${cv.skills.map((group) => `- ${group.label}: ${group.items.join(", ")}`).join("\n")}

## Experience

${experience}

### Earlier

${cv.earlier.map((job) => `- ${job.company}, ${job.title} (${job.period})`).join("\n")}

## Education & Certifications

${cv.education.map((item) => `- ${item}`).join("\n")}

## Languages

${cv.languages.map((item) => `- ${item}`).join("\n")}

## Contact

For more information, visit https://www.acedzn.dev
  `.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
