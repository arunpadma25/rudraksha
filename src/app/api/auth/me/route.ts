import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

// Always read the live session; never serve a cached response, so the client
// navbar reflects the real auth state even on statically cached pages.
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json(
    { user },
    { headers: { "Cache-Control": "no-store" } }
  );
}
