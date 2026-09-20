import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const _cookie = await cookies();
  const supabase = await server(_cookie);

  const { work_id, image_urls } = await req.json();

  if (!work_id || !Array.isArray(image_urls) || image_urls.length === 0) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  // 校验：这个作品属于当前登录用户
  const { data: work, error: workErr } = await supabase
    .from("portfolio_works")
    .select("id")
    .eq("id", work_id)
    .single();

  if (workErr || !work) {
    return NextResponse.json({ error: "作品不存在或无权限" }, { status: 403 });
  }

  // 组装批量插入数据，sort_order按数组顺序
  const insertRows = image_urls.map((url, idx) => ({
    work_id,
    image_url: url,
    sort_order: idx,
  }));

  const { data, error } = await supabase
    .from("portfolio_work_images")
    .insert(insertRows)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 200 });
}

export async function GET(req: Request) {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const { data, error } = await supabase
    .from("portfolio_work_images")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data }, { status: 200 });
}
