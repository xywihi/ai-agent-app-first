"use client";

import { ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ToTop = () => {
  return (
    <Tooltip disableHoverablePopup>
      <TooltipTrigger
        className="bg-white dark:bg-gray-700 border border-gray-400 cursor-pointer shadow-xl hover:bg-teal-400 dark:bg-teal-600 font-bold py-2 px-4 rounded-full"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <ArrowUp size={24} />
      </TooltipTrigger>
      <TooltipContent sideOffset={2} side="left">
        <p>回到顶部</p>
      </TooltipContent>
    </Tooltip>
  );
};
