import { getUserList } from "@/lib/data/user/user-list";
import { reportErrorLog } from "@/lib/reportError";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const data = await getUserList();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_list_users_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
