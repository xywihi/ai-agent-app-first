import { getDefaultPortfolio } from "@/lib/data/portfolio";
import { reportErrorLog } from "@/lib/reportError";
import { NextResponse } from "next/server";

// 获取作品列表
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "all";
    const data = await getDefaultPortfolio(category);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log("portfolio error", error);
    await reportErrorLog({
      errorType: "api_portfolio_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常" }), {
      status: 500,
    });
  }
}
