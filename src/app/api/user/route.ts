import { reportErrorLog } from "@/lib/reportError";
import supabase from "@/lib/server/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET(req: NextRequest) {
  try {
    const _cookies = await cookies();
    const _supabase = await supabase(_cookies);
    const user = await _supabase.auth.getUser();
    if (!user.data.user)
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    await reportErrorLog({
      errorType: "api_get_user_error",
      error,
    });
    return new Response(JSON.stringify({ error: error, data: null }), {
      status: 500,
    });
  }
}
