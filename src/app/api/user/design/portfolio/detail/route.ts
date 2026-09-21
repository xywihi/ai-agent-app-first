import { getDetailPortfolio } from "@/lib/data/portfolio/detail";
import { NextResponse } from "next/server";

// 获取作品列表
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const data = await getDetailPortfolio(id || "");
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
