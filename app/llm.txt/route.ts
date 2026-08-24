import { NextResponse } from "next/server";

export async function GET() {
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

## Contact

For more information, visit https://www.acedzn.dev
  `.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
