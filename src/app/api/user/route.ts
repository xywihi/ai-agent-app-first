import { reportErrorLog } from "@/lib/reportError";
import { createServer } from "@/lib/server/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServer();
    const user = await supabase.auth.getUser();
    if (!user.data.user)
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    await reportErrorLog({
      errorType: "api_get_user_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
