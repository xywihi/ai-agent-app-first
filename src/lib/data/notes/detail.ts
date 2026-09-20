import server from "@/lib/server/server";
import { cookies } from "next/headers";

// 查询笔记
export async function getNote(noteId: string) {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const { data } = await supabase
    .from("frontend_notes")
    .select("*")
    .eq("id", noteId)
    .single();
  return data;
}
