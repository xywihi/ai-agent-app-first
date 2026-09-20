import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 喜欢该作品
export async function POST(req: Request) {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const { workId, id } = await req.json();
  const { data: _user_data } = await supabase.auth.getUser();
  if (!_user_data.user)
    return NextResponse.json({ error: "未登录" }, { status: 401 });

  if (!workId) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }
  const _like = {
    user_id: _user_data.user.id,
    work_id: workId,
  };
  if (id) {
    const { data: _data, error } = await supabase
      .from("portfolio_work_likes")
      .delete()
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { success: true, data: "成功取消喜欢" },
      { status: 200 }
    );
  }
  const { data, error } = await supabase
    .from("portfolio_work_likes")
    .insert(_like)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { success: true, data: "喜欢成功" },
    { status: 200 }
  );
}
