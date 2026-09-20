import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 获取作品列表
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const { data: _data, error } = await supabase
    .from("portfolio_works")
    .select(
      `*, portfolio_categories(title,icon_name,id,key_name),
    portfolio_work_images(*),
    portfolio_work_likes(*),
    portfolio_work_collects(*)`
    )
    .eq("is_published", true)
    .eq("id", id)
    .single();
  if (!_data) return;
  _data.actions = {
    like: {
      count: _data.like_count,
      active: _data.portfolio_work_likes.length > 0,
    },
    star: {
      count: _data.collect_count,
      active: _data.portfolio_work_collects.length > 0,
    },
    share: {
      count: _data.share_count,
    },
  };
  const data = _data as ProcessedPortfolioWork;
  if (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
  return NextResponse.json({ success: true, data }, { status: 200 });
}
