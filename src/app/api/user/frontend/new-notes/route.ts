import { getNewNotes } from "@/lib/data/notes/new-notes";
import { reportErrorLog } from "@/lib/reportError";
import server from "@/lib/server/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { list, noteTotal, totalView } = await getNewNotes();
    return NextResponse.json(
      { data: { list, noteTotal, totalView } },
      { status: 200 }
    );
  } catch (error: unknown) {
    await reportErrorLog({
      errorType: "api_get_new_notes_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
