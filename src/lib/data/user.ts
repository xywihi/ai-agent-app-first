import { reportBackendError } from "../server/reportBackendError";
import { cookies } from "next/headers";
import server from "../server/server";
import { QueryKeys } from "@/app/utils/query-keys";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { unstable_cache } from "next/cache";
import getUserClaimsServer from "./userClaimsServer";

// 获取公共值

// 获取用户信息
async function _getUserInfo(_cookie: ReadonlyRequestCookies) {
  try {
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
    // const {data:} = await supabase.auth.getClaims();
    const userId = await getUserClaimsServer();
    const { data, error } = await supabase
      .from("profiles")
      .select("id,display_name,avatar_url,bio")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    return data ?? null;
  } catch (error) {
    await reportBackendError({
      path: "/lib/data/user/getUserProfiles",
      errorType: "get_default_portfolio_error",
      error,
      meta: {},
    });
  }
}

export const getUserInfo = async () => {
  const _cookies = await cookies();
  // const _unstable_cache = unstable_cache(
  //   async () => await _getUserInfo(_cookies),
  //   [...QueryKeys.userCenter.data],
  //   {
  //     revalidate: 1, // 表示每 300 秒重新生成缓存
  //   }
  // );
  // const data = await _unstable_cache();
  const data = await _getUserInfo(_cookies);
  return data;
};
