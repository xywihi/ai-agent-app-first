import {
  addPortfolioCategory,
  getPortfolioCategories,
} from "@/lib/data/portfolio/categories";
import { NextResponse } from "next/server";

// 获取作品列表
export async function GET(req: Request) {
  try {
    const data = await getPortfolioCategories();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log("portfolio categories error", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// 新增类别
export async function POST(req: Request) {
  try {
    const { category } = await req.json();
    const data = await addPortfolioCategory(category);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log("add portfolio category error", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
