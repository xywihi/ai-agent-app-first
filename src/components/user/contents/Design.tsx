"use client";
import { getCategoryTree } from "@/app/utils/api/font-notes/requery";
import { CategoryTree, Note } from "@/app/utils/api/font-notes/typs";
import { cn, getTime } from "@/app/utils/tools";
import { EditeNoteForm } from "@/components/frontNote/EditeNoteForm";
import { GlobalModel } from "@/components/GlobalModel";
import { ToTop } from "@/components/ToTop";
import { Button } from "@/components/ui/button";
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
  Eye,
  Star,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import { EditePortfolioForm } from "./EditePortfolioForm";
import { getPortfolioCategories } from "@/app/utils/api/design/reuqery";
import {
  PortfolioCategory,
  PortfolioWork,
  ProcessedPortfolioWork,
} from "@/app/utils/api/design/type";
import Image from "next/image";

export default function Design() {
  const [createNew, setCreateNew] = useState(false);
  const [portfolioWorksList, setPortfolioWorksList] = useState<
    ProcessedPortfolioWork[]
  >([]);
  const { data, isPending } = useQuery({
    queryKey: ["portfolioWorks_data"],
    queryFn: async () => {
      const _data = await fetch(`/api/user/design/portfolio`);
      const data = await _data.json();
      return data.data;
    },
  });

  const data_update = useMemo(() => {
    const _data: React.JSX.Element[] = [];
    if (!data) return null;
    console.log("portfolioWorks_data", data);
    for (const key in data) {
      const items = data[key];
      if (typeof items === "object")
        _data.push(
          <div key={key}>
            <p className="font-bold text-4xl text-gray-400 mb-4">{key}</p>
            <div className="grid grid-cols-4 gap-4">
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
              "bg-white border border-gray-400 cursor-pointer shadow-xl hover:bg-teal-400 font-bold py-2 px-4 rounded-full"
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
            <Card className="bg-white w-full self-center">
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
  const handleToDelete = (id: string) => {
    const res = confirm("确定删除吗?");
    if (res) {
      fetch(`/api/user/frontend/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.status === 200) {
          alert("删除成功");
        }
      });
    }
  };
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-xl transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
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
            <span className="bg-gray-100 text-gray-400 rounded-xl px-2 py-1 inline-block text-xs mb-4">
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
                    className="bg-gray-100 text-gray-400 rounded-xl px-2 py-1 inline-block text-xs my-4"
                  >
                    {item}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-2 my-4">
          <Tooltip>
            <TooltipTrigger
              className="flex-1 rounded hover:bg-gray-100 py-2 cursor-pointer"
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
              className="flex-1 rounded hover:bg-gray-100 py-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setEditable(true);
              }}
            >
              <div className="border-gray-300 flex justify-center">
                <Edit size={14} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>编辑作品</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="flex-1 rounded hover:bg-gray-100 py-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleToDelete(work.id as string);
              }}
            >
              <div className="border-gray-300 flex justify-center">
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
          <Card className="bg-white w-full self-center">
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
