import { deletePortfolioImg } from "@/lib/data/portfolio/deleteImg";
import { reportErrorLog } from "@/lib/reportError";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const data = await deletePortfolioImg(id);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    await reportErrorLog({
      errorType: "api_public_portfolio_delete_img_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常" }), {
      status: 500,
    });
  }
}
