import server from "@/lib/server/server";
import { cookies } from "next/headers";

export const getNewNotes = async () => {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
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
    .order("updated_at", { ascending: false })
    .limit(8);
  if (error) {
    // console.log("error", error);
    throw new Error(error.message);
  }
  if (!data) return { list: [], noteTotal: 0, totalView: 0 };
  const noteTotal = count ?? 0;
  const totalView =
    data.reduce((acc, item) => {
      return acc + (item.view_count ?? 0);
    }, 0) || 0;
  return { list: data, noteTotal, totalView };
};
