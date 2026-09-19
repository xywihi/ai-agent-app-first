"use client";
import { cn, getTime } from "@/app/utils/tools";
import { GlobalModel } from "@/components/GlobalModel";
import { ToTop } from "@/components/ToTop";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import {
  BookSearch,
  Calendar,
  Edit,
  Star,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";
import { EditePortfolioForm } from "./EditePortfolioForm";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import Image from "next/image";
import { QueryKeys } from "@/app/utils/query-keys";
import { Delete, Get } from "@/app/utils/query";
import { toast } from "sonner";

export default function Design() {
  const [createNew, setCreateNew] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: QueryKeys.portfolio.portfoliosAll,
    queryFn: async () => {
      const data = await Get(`/api/user/design/portfolio`);
      console.log("data----", data);
      return data;
    },
  });

  const data_update = useMemo(() => {
    const _data: React.JSX.Element[] = [];
    if (!data) return null;
    for (const key in data) {
      const items = data[key];
      if (typeof items === "object")
        _data.push(
          <div key={key}>
            <p className="font-bold text-4xl text-gray-400 mb-4">{key}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {items &&
                items?.map((_item: ProcessedPortfolioWork) => (
                  <PortfolioItem key={_item.id} work={_item} />
                ))}
            </div>
          </div>
        );
    }
    return _data;
  }, [data]);

  return (
    <div>
      {isPending ? (
        <div className="flex-1 text-center h-[calc(100vh-10rem)] flex flex-col justify-center items-center text-xl">
          作品正在努力加载中...
        </div>
      ) : (
        data_update
      )}
      <div className="fixed bottom-28 right-8 z-50 flex items-center gap-4">
        <Tooltip disableHoverablePopup>
          <TooltipTrigger
            className={cn(
              "bg-white dark:bg-gray-700 border border-gray-400 cursor-pointer shadow-xl hover:bg-teal-400 dark:bg-teal-600 font-bold py-2 px-4 rounded-full"
            )}
            onClick={() => setCreateNew(true)}
          >
            <Edit size={24} />
          </TooltipTrigger>
          <TooltipContent sideOffset={2} side="left">
            创建新的设计作品
          </TooltipContent>
        </Tooltip>
        <ToTop />
        {createNew && (
          <GlobalModel>
            <Card className="bg-white dark:bg-gray-700 w-full self-center">
              <CardContent>
                <EditePortfolioForm setEditable={setCreateNew} />
              </CardContent>
            </Card>
          </GlobalModel>
        )}
      </div>
    </div>
  );
}

const PortfolioItem = memo(function PortfolioItem({
  work,
}: {
  work: ProcessedPortfolioWork;
}) {
  const router = useRouter();
  const [editable, setEditable] = useState(false);

  const handleToSee = () => {
    router.push(`/design/detail/${work.id}`);
  };
  const handleToDelete = async (id: string) => {
    const res = confirm("确定删除吗?");
    if (res) {
      const res = await Delete(`/api/user/frontend/${id}`);
      if (res) {
        toast.success("删除成功");
      }
    }
  };
  return (
    <div
      className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-xl transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
      onClick={handleToSee}
    >
      <div className="pt-0 h-full flex flex-col justify-between">
        <div>
          {work.portfolio_work_images?.[0] && (
            <Image
              src={work.portfolio_work_images[0]?.image_url}
              alt={work.title}
              width={400}
              height={400}
              className="mb-4 object-cover object-top w-full h-48 overflow-hidden"
            />
          )}
          <div className="px-4">
            <p className="font-bold text-lg mb-2 truncate">{work.title}</p>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl px-2 py-1 inline-block text-xs mb-4">
              {work.portfolio_categories.title}
            </span>
            <div className="flex justify-between">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                {work.updated_at && getTime(work.updated_at)}
              </p>
              <div className="flex gap-4 items-center">
                {/* <p className="text-sm text-gray-400 flex items-center gap-2">
            <Eye size={14} />
            {work.view_count}
          </p> */}
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <ThumbsUp size={14} />
                  {work.like_count}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Star size={14} />
                  {work.collect_count}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {work.tags &&
                work.tags.map((item, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl px-2 py-1 inline-block text-xs my-4"
                  >
                    {item}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-2 my-4 px-2">
          <Tooltip>
            <TooltipTrigger
              className="flex-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-600 py-2 cursor-pointer"
              onClick={handleToSee}
            >
              <div className="flex justify-center">
                <BookSearch size={14} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>查看作品</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="flex-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-600 py-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setEditable(true);
              }}
            >
              <div className="border-gray-300 dark:border-gray-600 flex justify-center">
                <Edit size={14} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>编辑作品</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="flex-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-600 py-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleToDelete(work.id as string);
              }}
            >
              <div className="border-gray-300 dark:border-gray-600 flex justify-center">
                <Trash size={14} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>删除作品</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {editable && (
        <GlobalModel>
          <Card className="bg-white dark:bg-gray-700 w-full self-center">
            <CardContent>
              <EditePortfolioForm
                // portfolio_data={note}
                setEditable={setEditable}
              />
            </CardContent>
          </Card>
        </GlobalModel>
      )}
    </div>
  );
});
