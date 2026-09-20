import { reportBackendError } from "../server/reportBackendError";
import { cookies } from "next/headers";
import server from "../server/server";

// 获取公共值

// 获取用户信息
export async function getUserInfo() {
  try {
    const _cookie = await cookies();
    const supabase = await server(_cookie);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return user;
  } catch (error) {
    console.log("userInfo api error", error);
    await reportBackendError({
      path: "/lib/data/user/getUserInfo",
      errorType: "api_get_user_info_error",
      error,
    });
  }
}

// 获取用户profiles信息
export async function getUserProfiles() {
  try {
    const _cookie = await cookies();
    const supabase = await server(_cookie);
    const user = await supabase.auth.getUser();
    if (!user.data.user?.id) {
      throw new Error("user_id is required");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.data.user?.id)
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }

    return data ?? {};
  } catch (error) {
    console.log("profiles api error", error);
    await reportBackendError({
      path: "/lib/data/user/getUserProfiles",
      errorType: "get_default_portfolio_error",
      error,
      meta: {},
    });
  }
}
