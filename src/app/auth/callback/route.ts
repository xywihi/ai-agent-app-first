import { NextResponse } from "next/server";
import { createServer } from "@/lib/server/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createServer();
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(`${origin}/login`);
  }
}
