"use client";
import { ProcessedPortfolioWork } from "@/app/utils/api/design/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useRef } from "react";

export const Author = ({ card }: { card: ProcessedPortfolioWork }) => {
  const currentScrollTop = useRef(0);
  useEffect(() => {
    const container = document.getElementById("global_anln");
    // 监听滚动事件
    const handleScroll = () => {
      if (container) {
        const element = document.getElementById("author");
        if (element) {
          if (
            currentScrollTop.current < container.scrollTop &&
            container.scrollTop > 50
          ) {
            element.classList.add("-translate-y-30!");
          } else {
            element.classList.remove("-translate-y-30!");
          }
        }
        currentScrollTop.current = container.scrollTop;
      }
    };
    if (container) container.addEventListener("scroll", handleScroll);
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [card]);
  return (
    <div
      id="author"
      className="fixed top-22 left-1/2 -translate-x-1/2 z-49 w-full xl:w-[calc(100%-2rem)] lg:max-w-[calc(50%-1rem)] p-4 transform translate-y-0 flex justify-between items-center bg-white dark:bg-gray-700 xl:rounded-xl shadow-xl shadow-gray-400/15 mb-2 transition-all duration-600 ease-in-out"
    >
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={card.author?.avatar_url}
            alt={card.author?.display_name}
          />
          <AvatarFallback>{card.author?.display_name}</AvatarFallback>
        </Avatar>
        <span className="text-lg font-bold">{card.author?.display_name}</span>
      </div>
      {false ? (
        <Button className="bg-teal-300 dark:bg-teal-600">
          <Plus />
          关注
        </Button>
      ) : (
        <Button className="bg-gray-200 dark:bg-gray-800 text-gray-400">
          已关注
        </Button>
      )}
    </div>
  );
};
