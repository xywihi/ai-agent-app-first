import { createClient } from "@/lib/server/client";
// 获取公共值
const client = createClient();

// 获取作品集类型
export async function getPortfolioCategories() {
  const user = await client.auth.getUser();
  const userId = user.data.user?.id;
  if (!userId) {
    throw new Error("user_id is required");
  }
  const { data, error } = await client
    .from("portfolio_categories")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });
  if (error) {
    throw error;
  }
  return new Response(JSON.stringify({ error: null, data }), { status: 200 });
}
// 获取作品集
export async function getPortfolioWorks(userId: string | null = null) {
  if (!userId) {
    throw new Error("user_id is required");
  }
  const { data, error } = await client
    .from("portfolio_works")
    .select(
      `"*",portfolio_work_images(image_url),portfolio_categories(title,icon_name)`
    )
    .eq("is_published", true) // 发布的作品集
    .order("portfolio_work_images.sort_order", { ascending: false });

  if (error) {
    throw error;
  }
  return new Response(JSON.stringify({ error: null, data }), { status: 200 });
}
// //同时拿到作品列表+自己的点赞收藏状态
export async function getPortfolioLikes(userId: string | null = null) {
  const user = await client.auth.getUser();
  const uid = user.data.user?.id;
  const { data, error } = await client
    .from("portfolio_works")
    .select(
      `
   *,
   portfolio_work_images(*),
   user_like:portfolio_work_likes!inner(id,user_id),
   user_collect:portfolio_work_collects!inner(id,user_id)
 `,
      { count: "exact" }
    )
    .eq("portfolio_work_likes.user_id", uid)
    .eq("portfolio_work_collects.user_id", uid);

  if (error) {
    throw error;
  }
  return new Response(JSON.stringify({ error: null, data }), { status: 200 });
}
