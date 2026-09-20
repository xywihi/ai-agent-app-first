import { NextResponse } from "next/server";
import server from "@/lib/server/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  if (code) {
    const _cookie = await cookies();
    const supabase = await server(_cookie);
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(`${origin}/login`);
  }
}
