"use server";

import { z } from "zod";
import server from "@/lib/server/server";
import { cookies } from "next/headers";

const messageSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email().max(100),
  content: z.string().min(5).max(500),
});

export async function submitAboutMessage(rawData: unknown) {
  const parseResult = messageSchema.safeParse(rawData);
  if (!parseResult.success) {
    return { success: false, error: "数据格式错误" };
  }
  const data = parseResult.data;

  const cookieStore = await cookies();
  const supabase = await server(cookieStore);
  const { data: userData } = await supabase.auth.getUser();

  // 插入留言表，可选：记录用户id（登录用户）
  const { error } = await supabase.from("about_messages").insert({
    name: data.name,
    email: data.email,
    content: data.content,
    user_id: userData.user?.id ?? null,
  });

  if (error) {
    console.error("留言写入失败：", error);
    return { success: false, error: "数据库错误" };
  }

  return { success: true };
}
