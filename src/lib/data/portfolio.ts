import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import server from "@/lib/server/server";
import { reportBackendError } from "../server/reportBackendError";
import { unstable_cache } from "next/cache";
import { QueryKeys } from "@/app/utils/query-keys";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const _getDefaultPortfolio = async (
  category: string,
  _cookies: ReadonlyRequestCookies
) => {
  try {
    const supabase = await server(_cookies);
    let data: ProcessedPortfolioWork[] = [];
    if (category === "all") {
      const { data: _data, error } = await supabase
        .from("portfolio_works")
        .select(
          `*, portfolio_categories(title,icon_name,id,key_name),
          portfolio_work_images(*),
          portfolio_work_likes(*),
          portfolio_work_collects(*)`
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      data = _data as ProcessedPortfolioWork[];
      if (error) throw new Error("Failed to load portfolio works");
    } else {
      const { data: _data, error } = await supabase
        .from("portfolio_categories")
        .select("id,key_name")
        .eq("key_name", category);
      if (_data && !!_data.length) {
        const category_id = _data[0].id;
        const { data: __data, error } = await supabase
          .from("portfolio_works")
          .select(
            `*, portfolio_categories(title,icon_name,id,key_name),
          portfolio_work_images(*),
          portfolio_work_likes(*),
          portfolio_work_collects(*)`
          )
          .eq("is_published", true)
          .eq("category_id", category_id)
          .order("created_at", { ascending: false })
          .limit(1, { referencedTable: "portfolio_work_likes" });
        data = __data as ProcessedPortfolioWork[];
      }
      if (error) throw new Error("Failed to load portfolio works");
    }
    data.forEach((item: ProcessedPortfolioWork) => {
      item.actions = {
        like: {
          count: item.like_count,
          active: item.portfolio_work_likes.length > 0,
        },
        star: {
          count: item.collect_count,
          active: item.portfolio_work_collects.length > 0,
        },
        share: {
          count: item.share_count,
        },
      };
    });
    return { list: data ?? [] };
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
export const getDefaultPortfolio = async (category: string) => {
  const _cookies = await cookies();
  const _unstable_cache = unstable_cache(
    async () => await _getDefaultPortfolio(category, _cookies),
    [...QueryKeys.portfolio.data],
    {
      revalidate: 1, // 表示每 300 秒重新生成缓存
    }
  );
  const data = await _unstable_cache();
  return data;
};
