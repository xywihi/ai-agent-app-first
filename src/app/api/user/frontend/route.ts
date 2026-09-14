import { reportErrorLog } from "@/lib/reportError";
import { createServer } from "@/lib/server/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // const { searchParams } = new URL(req.url);
    // const noteId = searchParams.get("noteId");
    const supabase = await createServer();
    const { data: _data } = await supabase
      .from("frontend_notes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!_data) return;
    //根据创建月份，进行分类
    const _data2 = _data.map((item) => {
      // 如果年份是今年，显示月份，否则显示年份和月份
      if (item.created_at.slice(0, 4) === new Date().getFullYear().toString()) {
        item.created_at = item.created_at.slice(5, 7);
      } else {
        item.created_at = item.created_at.slice(0, 7);
      }
      return item;
    });

    const data = _data2.reduce((acc, item) => {
      if (!acc[item.created_at]) {
        acc[item.created_at] = [];
      }
      acc[item.created_at].push(item);
      return acc;
    }, {});

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    await reportErrorLog({
      errorType: "api_update_note_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
