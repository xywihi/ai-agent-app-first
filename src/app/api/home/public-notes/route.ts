import { getFrontNotes } from "@/lib/data/notes";
import { reportErrorLog } from "@/lib/reportError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const data = await getFrontNotes();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_public_note_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常" }), {
      status: 500,
    });
  }
}
