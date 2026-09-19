// 删除笔记
import { reportErrorLog } from "@/lib/reportError";
import { createServer } from "@/lib/server/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createServer();
    const { id } = await req.json();
    const { data } = await supabase
      .from("frontend_notes")
      .delete()
      .eq("id", id);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_delete_note_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
