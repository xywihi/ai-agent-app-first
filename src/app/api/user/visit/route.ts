import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 获取浏览记录
export async function GET(req: Request) {
  // 计算7天前时间
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const { data: portfolio_visits_data, error: portfolio_error } = await supabase
    .from("portfolio_visits")
    .select(
      `*, portfolio_works(title,id,tags,description,portfolio_work_images(image_url))`
    )
    .gte("visited_at", oneWeekAgo.toISOString())
    .order("visited_at", { ascending: false });
  if (portfolio_error) {
    return NextResponse.json(
      { error: portfolio_error.message },
      { status: 500 }
    );
  }
  const { data: note_visits_data, error: note_error } = await supabase
    .from("frontend_note_visits")
    .select(
      `*, frontend_notes(title,category_id,sub_category_id,id,note_categories(name))`
    )
    .gte("visited_at", oneWeekAgo.toISOString())
    .order("visited_at", { ascending: false });
  if (note_error) {
    return NextResponse.json({ error: note_error.message }, { status: 500 });
  }

  return NextResponse.json(
    { success: true, data: { portfolio_visits_data, note_visits_data } },
    { status: 200 }
  );
}
