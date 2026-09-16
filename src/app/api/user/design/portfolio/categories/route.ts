import { createServer } from "@/lib/server/server";
import { NextResponse } from "next/server";

// 获取作品列表
export async function GET(req: Request) {
  const supabase = await createServer();
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (!userId) {
    throw new Error("user_id is required");
  }
  const { data: data, error } = await supabase
    .from("portfolio_categories")
    .select("*");
  const all = {
    id: "all",
    key_name: "all",
    title: "全部",
    icon_name: "layers",
    total_count: 0,
    path: "/design/all",
    description:
      "用户界面设计，聚焦数字产品的视觉呈现与交互细节。通过布局、色彩、图标、控件等元素的系统化编排，让产品在美观的同时具备清晰的操作逻辑与一致的使用体验。",
    user_id: userId,
  };
  const totalCount = data?.reduce((acc, item) => {
    acc += item.total_count;
    return acc;
  }, 0);
  all.total_count = totalCount || 0;
  data?.unshift(all);
  if (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
  return NextResponse.json({ success: true, data }, { status: 200 });
}

// 新增类别
export async function POST(req: Request) {
  const supabase = await createServer();
  const { category } = await req.json();
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (!userId) {
    throw new Error("user_id is required");
  }
  category.user_id = userId;
  const { data, error } = await supabase
    .from("portfolio_categories")
    .insert(category)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data }, { status: 200 });
}
