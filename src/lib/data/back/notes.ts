import { QueryKeys } from "@/app/utils/query-keys";
import serverClient from "@/lib/server/createServer_back";
import { unstable_cache } from "next/cache"; //用于缓存
const _getFrontNotesB = async () => {
  try {
    // const { searchParams } = new URL(req.url);
    // const noteId = searchParams.get("noteId");
    const supabase = await serverClient();
    const { data, count, error } = await supabase
      .from("frontend_notes")
      .select("id,title,view_count,updated_at,category_id,sub_category_id", {
        count: "exact",
        /*  1.  exact ：精确计数，扫描全部匹配行，数据量大时会慢；适合你的笔记场景（个人笔记数量不多）
          2.  planned ：使用查询计划估算行数，速度快，数值有误差
          3.  estimated ：使用数据库统计信息估算，速度最快，误差更大
          当你设置  count  参数时，查询结果会多出  .count  属性存放统计数字。 */

        /* -  head:true ：数据库只做统计，不把 select 命中的记录返回给前端， data = null ，网络传输极小
          -  head:false ：返回命中的完整记录数据，同时附带 count */
        head: false,
      })
      .order("view_count", { ascending: false })
      .eq("is_published", true)
      .limit(8);
    if (error) {
      // console.log("error", error);
      throw error;
    }
    if (!data) return;
    const noteTotal = count ?? 0;
    const totalView =
      data.reduce((acc, item) => {
        return acc + (item.view_count ?? 0);
      }, 0) || 0;
    return { list: data, noteTotal, totalView };
  } catch (error: unknown) {
    console.log("notes api error", error);
  }
};
export const getFrontNotesB = async () => {
  const _unstable_cache = unstable_cache(
    async () => await _getFrontNotesB(),
    [...QueryKeys.fronend.new_notes],
    {
      revalidate: 300, // 表示每 300 秒重新生成缓存
    }
  );
  const data = await _unstable_cache();
  return data;
};
