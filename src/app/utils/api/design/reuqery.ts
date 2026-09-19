import { createClient } from "@/lib/server/client";
// 获取公共值
const client = createClient();

// 记录设计访问
export async function recordPortfolioVisit(portfolioId: string) {
  try {
    const {
      data: { user },
    } = await client.auth.getUser();
    const userId = user?.id;
    console.log("user", user);
    // 游客：每次访问直接记录，不做去重
    if (!userId) {
      await client
        .from("portfolio_visits")
        .insert([{ portfolio_id: portfolioId }]);
      return [];
    }

    // 登录用户：查询今日是否已有访问记录
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data, error } = await client
      .from("portfolio_visits")
      .select("id")
      .eq("portfolio_id", portfolioId)
      .eq("user_id", userId)
      .gte("visited_at", todayStart.toISOString())
      .limit(1);
    if (error) {
      console.log("error", error);
      throw new Error(error.message);
    }
    // 今天没有访问记录，才插入
    if (data && data.length === 0) {
      await client
        .from("portfolio_visits")
        .insert([{ portfolio_id: portfolioId, user_id: userId }]);
    } else {
      console.log("今日已有访问记录", data[0].id, new Date().toISOString());
      //更新访问时间
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { error } = await client
        .from("portfolio_visits")
        .update({ visited_at: new Date().toISOString() })
        .eq("id", data[0].id);
      if (error) {
        console.log("error", error);
        throw new Error(error.message);
      }
    }
    return [];
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

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
