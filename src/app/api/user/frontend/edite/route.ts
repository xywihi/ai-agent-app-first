//编辑笔记
import { reportErrorLog } from "@/lib/reportError";
import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const _cookie = await cookies();
    const supabase = await server(_cookie);
    const { note } = await req.json();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    const { data } = await supabase
      .from("frontend_notes")
      .update({ ...note, owner_id: user?.id })
      .eq("id", note.id);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_update_note_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
