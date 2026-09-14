import { createClient } from "@/lib/server/client";
import { reportErrorLog } from "@/lib/reportError";

// 获取公共值
const client = createClient();
// 模糊搜索
function escapeLikePattern(str: string) {
  return str.replace(/([%_])/g, "\\$1");
}
export async function fuzzySearchAll(keyValue: string) {
  try {
    const escaped = escapeLikePattern(keyValue);
    const pattern = `%${escaped}%`;
    const { data, error } = await client
      .from("frontend_notes")
      .select("id,title,content")
      // 构建权重：标题命中=10，内容命中=1
      .select("*")
      .or(`title.ilike.${pattern},content.ilike.${pattern}`)
      .order("title", { ascending: false })
      .order("content", { ascending: false });
    //   .limit(4); // 取出权重最高前4条
    if (error) {
      throw error;
    }
    console.log("data", data);
    return new Response(JSON.stringify({ error: null, data }), {
      status: 200,
    });
  } catch (error) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_fuzzy_search_all_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
