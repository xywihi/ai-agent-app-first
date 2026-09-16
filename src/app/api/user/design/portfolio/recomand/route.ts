import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { createServer } from "@/lib/server/server";
import { NextResponse } from "next/server";

// 获取作品列表
export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId");
  const id = url.searchParams.get("id");
  const supabase = await createServer();
  console.log("categoryId", categoryId);
  let data: ProcessedPortfolioWork[] = [];
  const { data: _data, error } = await supabase
    .from("portfolio_categories")
    .select("id,key_name")
    .eq("id", categoryId);
  if (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
  if (_data && !!_data.length) {
    const category_id = _data[0].id;
    console.log("category_id", category_id);
    const { data: __data, error } = await supabase
      .from("portfolio_works")
      .select(
        `*, portfolio_categories(title,icon_name,id,key_name),
        portfolio_work_images(*),
        portfolio_work_likes(*),
        portfolio_work_collects(*)`
      )
      .eq("is_published", true)
      .eq("category_id", category_id)
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(1, { referencedTable: "portfolio_work_likes" })
      .limit(5);
    if (error) return NextResponse.json({ error: error }, { status: 500 });
    __data.forEach((item: ProcessedPortfolioWork) => {
      item.actions = {
        like: {
          count: item.like_count,
          active: item.portfolio_work_likes.length > 0,
        },
        star: {
          count: item.collect_count,
          active: item.portfolio_work_collects.length > 0,
        },
        share: {
          count: item.share_count,
        },
      };
    });
    data = __data;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } else {
    return NextResponse.json({ success: true, data }, { status: 200 });
  }
}
