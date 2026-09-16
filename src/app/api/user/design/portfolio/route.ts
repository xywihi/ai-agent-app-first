import { createServer } from "@/lib/server/server";
import { NextResponse } from "next/server";

// 创建新的或编辑作品
export async function POST(req: Request) {
  const supabase = await createServer();
  const { work } = await req.json();
  const { data: _user_data } = await supabase.auth.getUser();
  if (!_user_data.user)
    return NextResponse.json({ error: "未登录" }, { status: 401 });

  if (!work) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }
  const _work = {
    user_id: _user_data.user.id,
    ...work,
  };
  const { data, error } = await supabase
    .from("portfolio_works")
    .insert(_work)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data }, { status: 200 });
}
// 获取作品列表
export async function GET(req: Request) {
  const supabase = await createServer();
  const { data: _data, error } = await supabase
    .from("portfolio_works")
    .select(
      `*, portfolio_categories(title,icon_name,id,key_name),portfolio_work_images(*)`
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(1, { referencedTable: "portfolio_work_images" });
  if (!_data) return;
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
  return NextResponse.json({ success: true, data }, { status: 200 });
}
