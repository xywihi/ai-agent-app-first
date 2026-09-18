import { createServer } from "@/lib/server/server";
import { NextResponse } from "next/server";

// 喜欢该作品
export async function POST(req: Request) {
  const supabase = await createServer();
  const { workId, id } = await req.json();
  const { data: _user_data } = await supabase.auth.getUser();
  if (!_user_data.user)
    return NextResponse.json({ error: "未登录" }, { status: 401 });

  if (!workId) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }
  const _collect = {
    user_id: _user_data.user.id,
    work_id: workId,
  };
  if (id) {
    const { data: _data, error } = await supabase
      .from("portfolio_work_collects")
      .delete()
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { success: true, data: "成功取消收藏" },
      { status: 200 }
    );
    // return NextResponse.json({ success: true, data: _data }, { status: 200 });
  }
  const { data, error } = await supabase
    .from("portfolio_work_collects")
    .insert(_collect)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { success: true, data: "成功收藏" },
    { status: 200 }
  );
}
