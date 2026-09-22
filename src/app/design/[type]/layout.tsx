import { Icon } from "@/components/Icon";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { ChevronRight, Feather } from "lucide-react";
import Image from "next/image";
import { cn } from "@/app/utils/tools";
import { PortfolioCategory } from "@/app/utils/api/design/type";
import { Suspense } from "react";
import Link from "next/link";
import { getPortfolioCategories } from "@/lib/data/portfolio/categories";
import { getUserProfiles } from "@/lib/data/user";

export default async function DesignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const [user_profiles, portfolio_categories] = await Promise.all([
    getUserProfiles(),
    getPortfolioCategories(),
  ]);
  const _portfolio_categories =
    portfolio_categories instanceof Error ? [] : portfolio_categories;
  return (
    <div className="flex justify-start items-start p-4">
      <div className="w-1/4 shrink-0 sticky top-22 hidden xl:block">
        <div className="min-h-[calc(100vh-10rem)] bg-gray-100 dark:bg-gray-800  rounded-2xl shadow-2xl py-8 px-6 m-4 flex flex-col justify-between">
          <div>
            <div className="w-[calc(100%+1.5rem)] mb-4 flex felx-row flex-nowrap items-center gap-6 shadow-md bg-white dark:bg-gray-700 p-4 py-8 rounded-l-2xl">
              <div className="w-20 h-20">
                {user_profiles?.avatar_url && (
                  <Image
                    width={100}
                    height={100}
                    alt=""
                    src={user_profiles?.avatar_url || null}
                    className={cn("w-20 h-20 rounded-full")}
                  ></Image>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold flex flex-row items-center gap-4">
                  设计作品集 <span>{"////////////"}</span>
                </h1>
                <p className="text-sm text-gray-400">Design Portfolio</p>
              </div>
            </div>
            <div className="mt-2 text-sm mb-6">
              自2017年投身UI与网页设计行业，擅长界面交互、网页、插画、海报及KV主视觉设计，兼顾设计创意与落地实现，注重真实可用的用户体验。
            </div>
            <hr className="border-gray-200 dark:border-gray-700 my-4" />
            <div className="overflow-auto max-h-[calc(100vh-36rem)]">
              <div className="flex flex-col gap-6">
                {_portfolio_categories.map((design: PortfolioCategory) => (
                  <Item
                    key={design.id}
                    className={cn(
                      "border overflow-hidden shadow-xl border-gray-300 dark:border-gray-600 group h-13 2xl:hover:h-42 hover:h-48 transition-all duration-500 ease-in-out",
                      design.path.includes(type as string) && "2xl:h-42 h-48",
                      {
                        "bg-teal-300 dark:bg-teal-600":
                          design.key_name === type,
                      }
                    )}
                  >
                    <div className="w-full flex flex-row justify-between items-center">
                      <ItemContent className="text-lg font-bold flex flex-row items-center">
                        {/* <Layers size={24} className="mr-2" /> */}
                        <Suspense>
                          <Icon
                            name={
                              design.icon_name as Parameters<
                                typeof Icon
                              >[0]["name"]
                            }
                            size={24}
                            className="mr-2"
                          />
                        </Suspense>
                        {design.title}
                      </ItemContent>
                      <ItemActions>
                        <div className="bg-gray-200 dark:bg-gray-700 hover:bg-teal-300 dark:hover:bg-teal-600 cursor-pointer rounded-lg">
                          <div className="group-hover:hidden px-2 py-1">
                            共计 {design.total_count} 个
                          </div>
                          <Link
                            href={design.path}
                            className="hidden group-hover:flex flex-row items-center px-2 py-1"
                          >
                            前往查看 <ChevronRight size={16} />
                          </Link>
                        </div>
                      </ItemActions>
                    </div>
                    <div
                      className={cn(
                        "w-full group-hover:visible group-hover:scale-100 invisible transform scale-0 transition-all duration-500 ease-in-out",
                        design.path.includes(type as string)
                          ? "visible scale-100"
                          : "invisible scale-0"
                      )}
                    >
                      <hr className="w-full border-gray-400/40 mb-4" />
                      <div>{design.description}</div>
                    </div>
                  </Item>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <Feather size={16} />
              {user_profiles?.display_name}
            </div>
            <div className="text-sm flex flex-row text-gray-500 justify-self-center">
              有 {_portfolio_categories?.[0]?.total_count} 个设计作品
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 xl:p-4">{children}</div>
    </div>
  );
}
