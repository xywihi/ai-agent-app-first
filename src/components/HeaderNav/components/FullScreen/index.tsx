"use client";
import { cn } from "@/app/utils/tools";
import { Fullscreen } from "lucide-react";

export default function FullScreen() {
  const hadleFullScreen = () => {
    const body = document.getElementById("global_anln");
    if (!body) return;
    body.requestFullscreen();
    if (document.fullscreenElement) {
      document.exitFullscreen();
      console.log("处于全屏", document.fullscreenElement);
    }
  };
  return (
    <div
      className={cn(
        "w-fit p-3 h-fit xl:p-2 shrink-0 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg group hover:text-teal-400 cursor-pointer transition-all"
      )}
      onClick={hadleFullScreen}
    >
      <Fullscreen size={16} />
    </div>
  );
}
