import getUserClaimsServer from "@/lib/data/userClaimsServer";
import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// 获取作品列表
export async function GET(req: Request) {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const userId = await getUserClaimsServer();
  const { data: _data, error } = await supabase
    .from("portfolio_works")
    .select(
      `*, portfolio_categories(title,icon_name,id,key_name),portfolio_work_images(*)`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  // .limit(1, { referencedTable: "portfolio_work_images" });
  if (!_data || !_data.length)
    return NextResponse.json({ data: null }, { status: 200 });
  //根据创建月份，进行分类
  const _data2 = _data.map((item) => {
    // 如果年份是今年，显示月份，否则显示年份和月份
    if (item.created_at.slice(0, 4) === new Date().getFullYear().toString()) {
      item.created_at = item.created_at.slice(5, 7);
    } else {
      item.created_at = item.created_at.slice(0, 7);
    }
    return item;
  });

  const data = _data2.reduce((acc, item) => {
    if (!acc[item.created_at]) {
      acc[item.created_at] = [];
    }
    acc[item.created_at].push(item);
    return acc;
  }, {});
  if (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 200 });
}
