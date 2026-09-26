import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 创建新的或编辑作品
export async function POST(req: Request) {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
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
    .update(_work)
    .eq("id", work.id);
  console.log("data", data, error);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data }, { status: 200 });
}
