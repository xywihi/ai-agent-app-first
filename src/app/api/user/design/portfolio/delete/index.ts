// 删除作品
import { reportErrorLog } from "@/lib/reportError";
import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const _cookie = await cookies();
    const supabase = await server(_cookie);
    const { id } = await req.json();
    const { data } = await supabase
      .from("portfolio_works")
      .delete()
      .eq("id", id);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("portfolio api error", error);
    await reportErrorLog({
      errorType: "api_delete_portfolio_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
