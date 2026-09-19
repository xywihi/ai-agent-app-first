import { createClient } from "@/lib/server/client";
import { reportErrorLog } from "@/lib/reportError";

// 获取公共值
const client = createClient();

// 获取用户信息
export async function getUserInfo() {
  try {
    const { data, error } = await client.auth.getUser();
    if (error) {
      throw error;
    }
    return new Response(JSON.stringify({ error: null, data }), { status: 200 });
  } catch (error) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_get_user_info_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}

// 获取用户profiles信息
export async function getUserProfiles() {
  try {
    const user = await createClient().auth.getUser();
    if (!user.data.user?.id) {
      throw new Error("user_id is required");
    }
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", user.data.user?.id)
      .single();
    if (error) {
      throw error;
    }
    console.log("****------", data);
    return new Response(JSON.stringify({ error: null, data }), { status: 200 });
  } catch (error) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_get_user_profiles_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
