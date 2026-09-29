"use client";
import { Suspense } from "react";
import { PortfolioList } from "./components/PortfolioList";
import { SkeletonD } from "./components/SkeletonD";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/app/utils/query-keys";
import { Get } from "@/app/utils/query";

export default function Design() {
  // const [showSearch, setShowSearch] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const { type } = useParams();
  const { data: portfolioWorks, isPending } = useQuery({
    queryKey: QueryKeys.portfolio.portfolios(type as string),
    queryFn: async () => {
      const data = await Get(
        `/api/user/design/portfolio/default?category=${type}`
      );
      return data;
    },
  });
  // const handleSearch = () => {
  //   console.log("search", searchValue);
  // };
  // console.log("portfolio_works", portfolio_works);
  return (
    <div>
      <div className="mb-6 flex flex-col xl:flex-row gap-4 justify-between items-center">
        <h1 className="text-gray-400 xl:text-2xl">
          {isPending ? (
            "作品加载中..."
          ) : (
            <>
              设计作品{" "}
              <span className="underline">
                {portfolioWorks && portfolioWorks.list.length}
              </span>{" "}
              个
            </>
          )}
        </h1>
        {/* 搜索框 */}
        {/* <div className="relative w-[calc(100%-1.5rem)] xl:w-auto">
          <div className="relative">
            <Input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowSearch((pre) => !pre);
                console.log("showSearch", showSearch);
              }}
              placeholder="搜索"
              className="w-full xl:w-120  p-4 rounded-2xl min-h-10"
            />
            <Button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleSearch}
            >
              <Search />
              搜索
            </Button>
          </div>
          {showSearch && (
            <div
              className="absolute mt-3 w-full bg-white dark:bg-gray-700/20 backdrop-blur-md p-4 rounded-2xl min-h-10 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>作品主推</h3>
              <ul className="mt-2 flex flex-row flex-wrap gap-2">
                <li
                  className="px-2 bg-gray-100 dark:bg-gray-800/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("UI设计");
                    setShowSearch(false);
                  }}
                >
                  UI设计
                </li>
                <li
                  className="px-2 bg-gray-100 dark:bg-gray-800/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("图标设计");
                    setShowSearch(false);
                  }}
                >
                  图标设计
                </li>
                <li
                  className="px-2 bg-gray-100 dark:bg-gray-800/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("图标设计");
                    setShowSearch(false);
                  }}
                >
                  LOGO设计
                </li>
              </ul>
            </div>
          )}
        </div> */}
      </div>
      <Suspense fallback={<SkeletonD />}>
        <PortfolioList portfolioWorks={portfolioWorks} isPending={isPending} />
      </Suspense>
    </div>
  );
}
