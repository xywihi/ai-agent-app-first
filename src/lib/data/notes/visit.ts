import server from "@/lib/server/server";
import { cookies } from "next/headers";

// 记录笔记访问
export async function recordNoteVisit(noteId: string) {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  // 游客：每次访问直接记录，不做去重
  if (!userId) {
    await supabase.from("frontend_note_visits").insert([{ note_id: noteId }]);
    return [];
  }

  // 登录用户：查询今日是否已有访问记录
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { data } = await supabase
    .from("frontend_note_visits")
    .select("id")
    .eq("note_id", noteId)
    .eq("user_id", userId)
    .gte("visited_at", todayStart.toISOString())
    .limit(1);

  // 今天没有访问记录，才插入
  if (data && data.length === 0) {
    await supabase
      .from("frontend_note_visits")
      .insert([{ note_id: noteId, user_id: userId }]);
    return [];
  } else {
    //更新访问时间
    await supabase
      .from("frontend_note_visits")
      .update({ visited_at: new Date().toISOString() })
      .eq("note_id", noteId)
      .eq("user_id", userId);
    return [];
  }
}
