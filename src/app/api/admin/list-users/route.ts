import { reportErrorLog } from "@/lib/reportError";
import { createServerAdmin } from "@/lib/server/serverAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = await createServerAdmin();
    // 从请求头拿到bearer token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "This endpoint requires a valid Bearer token" },
        { status: 401 }
      );
    }
    const [scheme, token] = authHeader.split(/\s+/); // 用正则分割，兼容多个空格
    if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
      return NextResponse.json(
        { error: "This endpoint requires a valid Bearer token" },
        { status: 401 }
      );
    }
    // console.group("token", token);
    // 用token校验用户身份
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);
    // console.log("user", user?.email);
    if (authError || !user) {
      return NextResponse.json(
        { error: "Bearer token invalid or expired" },
        { status: 401 }
      );
    }
    // 判断是否是管理员
    if (!user || user.email !== "anli_ang@yeah.net") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }
    // listUsers分页获取全部用户，默认50条一页
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      //   perPage: 100,
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // 拼接profiles表的自定义信息（头像、昵称）
    const userIds = data.users.map((u) => u.id);
    const { data: profiles, count: profileCount } = await supabaseAdmin
      .from("profiles")
      .select("id, avatar_url, display_name", {
        count: "exact",
      })
      .in("id", userIds);

    const result = data.users.map((user) => {
      const profile = profiles?.find((p) => p.id === user.id);
      return {
        id: user.id,
        email: user.email,
        last_sign_in_at: user.last_sign_in_at, // 最近登录时间，null=从未登录
        created_at: user.created_at,
        avatar_url: profile?.avatar_url,
        display_name: profile?.display_name,
        // 简易在线判断：比如2小时内有登录视为活跃（仅粗略判断，不是实时在线）
        is_online: user.last_sign_in_at
          ? new Date(user.last_sign_in_at) >
            new Date(Date.now() - 2 * 60 * 60 * 1000)
          : false,
        authority: user.email === "anli_ang@yeah.net" ? "admin" : "user",
      };
    });

    return NextResponse.json(
      { users: result, totalCount: profileCount },
      { status: 200 }
    );
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
