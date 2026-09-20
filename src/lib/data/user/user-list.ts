import server from "@/lib/server/server";
import { createServerAdmin } from "@/lib/server/serverAdmin";
import { cookies } from "next/headers";

export const getUserList = async () => {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const _authorization = await supabase.auth.refreshSession();
  const authorization = `Bearer ${_authorization.data.session?.access_token}`;
  const supabaseAdmin = await createServerAdmin();
  // 从请求头拿到bearer token
  if (!authorization) {
    return new Error("无效的token");
  }

  const [scheme, token] = authorization.split(/\s+/); // 用正则分割，兼容多个空格
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    return new Error("无效的token");
  }

  // console.group("token", token);
  // 用token校验用户身份
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);
  // console.log("user", user?.email);
  if (authError || !user) {
    return new Error("Bearer token invalid or expired");
  }
  // 判断是否是管理员
  if (!user || user.email !== "anli_ang@yeah.net") {
    return new Error("无权限");
  }
  // listUsers分页获取全部用户，默认50条一页
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    //   perPage: 100,
  });
  if (error)
    return new Error(
      `获取用户列表失败，code:${error.code}, message:${error.message}`
    );

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
  return { users: result, totalCount: profileCount };
};
