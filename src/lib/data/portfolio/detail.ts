import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import server from "@/lib/server/server";
import { reportBackendError } from "../../server/reportBackendError";
import { unstable_cache } from "next/cache";
import { QueryKeys } from "@/app/utils/query-keys";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const _getDetailPortfolio = async (
  id: string,
  _cookies: ReadonlyRequestCookies
) => {
  try {
    const supabase = await server(_cookies);
    const { data: _data, error } = await supabase
      .from("portfolio_works")
      .select(
        `*, portfolio_categories(title,icon_name,id,key_name),
    portfolio_work_images(*),
    portfolio_work_likes(*),
    portfolio_work_collects(*)`
      )
      .eq("is_published", true)
      .eq("id", id)
      .single();
    if (!_data) return;

    // 提取作者id
    const authorId = _data.user_id;
    // 批量查询profile
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id,display_name,avatar_url")
      .eq("id", authorId)
      .single();
    if (profilesError) throw new Error("Failed to load profiles");

    // 将profile数据添加到data中
    _data.author = profiles;
    _data.actions = {
      like: {
        count: _data.like_count,
        active: _data.portfolio_work_likes.length > 0,
      },
      star: {
        count: _data.collect_count,
        active: _data.portfolio_work_collects.length > 0,
      },
      share: {
        count: _data.share_count,
      },
    };
    const data = _data as ProcessedPortfolioWork;
    return data;
  } catch (error) {
    console.log("error", error);
    await reportBackendError({
      path: "/lib/data/portfolio",
      errorType: "get_default_portfolio_error",
      error,
      meta: {},
    });
  }
};

export const getDetailPortfolio = async (id: string) => {
  const _cookies = await cookies();
  // const _unstable_cache = unstable_cache(
  //   async () => await _getDetailPortfolio(id, _cookies),
  //   [...QueryKeys.portfolio.data],
  //   {
  //     revalidate: 300, // 表示每 300 秒重新生成缓存
  //   }
  // );
  // const data = await _unstable_cache();
  const data = await _getDetailPortfolio(id, _cookies);
  return data;
};
