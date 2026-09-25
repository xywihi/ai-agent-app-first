import { NoteUser } from "@/app/utils/api/font-notes/typs";
import server from "@/lib/server/server";
import { cookies } from "next/headers";

// export const getNoteUserList = async () => {
//   const _cookie = await cookies();
//   const supabase = await server(_cookie);
//   const { data, error } = await supabase.from("profiles").select(
//     "id,display_name,avatar_url,bio,frontend_notes!inner(id,title,view_count,updated_at)" // 嵌套查询，过滤掉子表为空的数据
//   );
//   // .order("updated_at", { ascending: false });
//   if (error) {
//     // console.log("error", error);
//     throw new Error(error.message);
//   }
//   return (data ?? []) as NoteUser[];
// };

export const getNoteUserList = async () => {
  const _cookie = await cookies();
  const supabase = await server(_cookie);

  // 1. 取出所有有笔记的owner_id，并且拿到每个用户最新一条笔记
  const {
    data: notesData,
    count,
    error: noteErr,
  } = await supabase
    .from("frontend_notes")
    .select("id,title,view_count,updated_at,owner_id", {
      count: "exact",
      /*  1.  exact ：精确计数，扫描全部匹配行，数据量大时会慢；适合你的笔记场景（个人笔记数量不多）
        2. planned ：使用查询计划估算行数，速度快，数值有误差
        3. estimated ：使用数据库统计信息估算，速度最快，误差更大
        当你设置  count  参数时，查询结果会多出  .count  属性存放统计数字。 */
      head: false,
    })
    .order("updated_at", { ascending: false });
  if (noteErr) throw new Error(noteErr.message);

  // 按owner分组，只保留每个用户第一条（最新）
  const noteMap = new Map<string, (typeof notesData)[0]>();
  notesData.forEach((note) => {
    if (!noteMap.has(note.owner_id)) {
      noteMap.set(note.owner_id, note);
    }
  });

  // 获取用户id列表
  const ownerIds = Array.from(noteMap.keys());

  // 2. 查询对应的profile信息
  const { data: profilesData, error: profileErr } = await supabase
    .from("profiles")
    .select("id,display_name,avatar_url,bio")
    .in("id", ownerIds);

  if (profileErr) throw new Error(profileErr.message);

  // 合并数据
  const result = profilesData.map((profile) => {
    const latestNote = noteMap.get(profile.id)!;
    return {
      ...profile,
      frontend_notes: [latestNote],
      count,
    };
  });

  // 按笔记时间倒序
  result.sort((a, b) => {
    return (
      new Date(b.frontend_notes[0].updated_at).getTime() -
      new Date(a.frontend_notes[0].updated_at).getTime()
    );
  });

  return result as unknown as NoteUser[];
};
