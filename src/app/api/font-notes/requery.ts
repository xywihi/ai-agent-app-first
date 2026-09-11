import { supabase } from "../../utils/query";
import { createClient } from "@/lib/server/client";
export async function recordNoteVisit(noteId: string) {
  const client = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user", user);
  return [];
  // // 游客：每次访问直接记录，不做去重
  // if(!userId){
  //   await supabase.from('frontend_note_visits').insert([{note_id:noteId}])
  //   return;
  // }

  // // 登录用户：查询今日是否已有访问记录
  // const todayStart = new Date();
  // todayStart.setHours(0,0,0,0);
  // const {data} = await supabase
  //   .from('frontend_note_visits')
  //   .select('id')
  //   .eq('note_id', noteId)
  //   .eq('user_id', userId)
  //   .gte('visited_at', todayStart.toISOString())
  //   .limit(1)

  // // 今天没有访问记录，才插入
  // if(data.length === 0){
  //   await supabase.from('frontend_note_visits').insert([
  //     {note_id: noteId, user_id: userId}
  //   ])
  // }
}
