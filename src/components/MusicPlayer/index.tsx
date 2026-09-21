"use client";
import useAudio from "@/hooks/use-audio";
import { cn } from "@/lib/utils";
import { GroundGlassCard } from "../GroundGlassCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Item, ItemActions, ItemContent, ItemTitle } from "../ui/item";
import { Pause, Play, SkipForward } from "lucide-react";
const audios = [
  {
    name: "Alarm Clock",
    src: "/audio/alarmClock.wav",
    id: 0,
  },
  {
    name: "好久不见",
    src: "/audio/haojiubujian.mp3",
    id: 1,
  },
  {
    name: "红梅花儿开",
    src: "/audio/hongmeihuaerkai.mp3",
    id: 2,
  },
  {
    name: "New",
    src: "/audio/new.mp3",
    id: 3,
  },
  {
    name: "宁愿",
    src: "/audio/ningyuan.mp3",
    id: 4,
  },
  {
    name: "Shine",
    src: "/audio/shine.mp3",
    id: 5,
  },
  {
    name: "Starts",
    src: "/audio/starts.mp3",
    id: 6,
  },
];
export const MusicPlayer = ({ className }: { className?: string }) => {
  const [index, setIndex] = useState(0);
  const [openList, setOpenList] = useState(false);
  const indexRef = useRef(0);
  const musicPlayerRef = useRef<HTMLDivElement>(null);
  const { play, stop, playing, progress, duration } = useAudio(
    audios[index].src,
    () => {
      indexRef.current = (indexRef.current + 1) % audios.length;
      setIndex(indexRef.current);
    }
  );
  const percent = useMemo(() => {
    if (!duration) return 0;
    return (progress / duration) * 100;
  }, [progress, duration]);
  const totalTime = useMemo(() => {
    if (!duration) return "00:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  }, [duration]);
  const currentTime = useMemo(() => {
    if (!progress) return "00:00";
    const minutes = Math.floor((duration - progress) / 60);
    const seconds = Math.floor((duration - progress) % 60);
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  }, [progress, duration]);
  useEffect(() => {
    // 全局点击回调
    const handleGlobalClick = (e: MouseEvent) => {
      // 如果点击目标在音乐播放器之内,则不关闭音乐播放器
      if (musicPlayerRef.current?.contains(e.target as Node)) {
        if (!openList) setOpenList(true);
        return;
      }

      if (openList) {
        setOpenList(false);
        // 捕获阶段阻止事件继续往下走到页面其他元素
        e.stopImmediatePropagation();
      }
      // 如果点击目标在音乐播放器之外,则关闭音乐播放器
    };
    document.addEventListener("mousedown", handleGlobalClick, {
      // passive: true,
      capture: true,
    }); //开启捕获模式capture：true，事件最先走到此回调；passive:true，不阻止默认行为。
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, [openList]);
  return (
    <div className={cn("group", className)} ref={musicPlayerRef}>
      <div
        className={cn(
          "pl-5 flex relative invisible flex-col space-y-2 mb-2 h-0 overflow-auto group-hover:visible group-hover:h-60 transition-all duration-650 delay-200 group-hover:delay-200 ease-in-out",
          {
            "visible h-60": openList,
          }
        )}
      >
        {audios.map((item, _index) => (
          <Item
            key={item.id}
            className={cn(
              "z-90 flex-nowrap border bg-white dark:bg-gray-700/20 backdrop-blur-md border-gray-200 dark:border-gray-700 opacity-0 transform translate-y-60 hover:-translate-x-5 group-hover:opacity-100 transition-all ease-in-out",
              `group-hover:translate-y-0 group-hover:delay-${
                200 + index * 100
              } delay-${200 + index * 100} duration-${1650 + index * 50} ${
                index === _index &&
                "-translate-x-5 border-2 animate-[bg-change_2s_ease-in-out_infinite]"
              }`,
              { "opacity-100 translate-y-0 delay-200": openList }
            )}
          >
            <ItemContent className="flex-1 min-w-0 flex max-w-md">
              {/* 文本省略号会受flex、width: fit-content影响 */}
              <ItemTitle className="block w-auto flex-1 min-w-0 truncate">
                {item.name}
              </ItemTitle>
              {/* <ItemDescription>{item}</ItemDescription> */}
            </ItemContent>
            <ItemActions
              className={cn("group-hover:block hidden shrink-0", {
                block: openList,
              })}
            >
              {_index === index ? (
                <Pause size={12} />
              ) : (
                <div
                  onClick={() => {
                    stop();
                    setIndex(() => {
                      play(true);
                      return _index;
                    });
                  }}
                  className="shrink-0 rounded-full w-6 h-6 bg-teal-500 text-white text-xs flex items-center justify-center transition-all duration-500"
                >
                  <Tooltip>
                    <TooltipTrigger>
                      {playing && index === _index ? (
                        <Pause size={12} />
                      ) : (
                        <Play size={12} />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>播放</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </ItemActions>
          </Item>
        ))}
      </div>
      <GroundGlassCard
        className={cn(
          "w-max h-fit p-2 transition-all duration-500 hover:delay-0 delay-100 "
        )}
        cardClassName={cn(
          "relative min-w-12 w-12 h-12 flex flex-row items-center justify-end gap-3 group-hover:w-88 transition-all duration-500 hover:delay-0 delay-300",
          currentTime && "w-43"
        )}
      >
        <div className="flex-1 w-full flex flex-row items-center justify-end space-x-3 px-3">
          {/* 时间 */}
          <div
            className={cn(
              "shrink-0 items-center gap-1 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 group-hover:flex group-hover:relative group-hover:duration-300 group-hover:delay-600 absolute transition-opacity duration-0 delay-300",
              currentTime && "relative opacity-100"
            )}
          >
            <span>{totalTime}</span>
            <span>/</span>
            <span>{currentTime}</span>
          </div>
          {/* 进度条 */}
          <div className="opacity-0 group-hover:opacity-100 group-hover:relative group-hover:duration-300 group-hover:delay-600 absolute transition-opacity duration-0 delay-0">
            <div className="relative">
              <div className="bg-gray-300 w-40 h-2 rounded-full"></div>
              <div
                className="bg-teal-300 dark:bg-teal-600 h-2 rounded-full absolute top-0 left-0"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <div
              className="absolute top-1/2 -translate-1/2 w-1.5 h-4 bg-teal-500 rounded-full transition-all duration-100"
              style={{ left: `${percent}%` }}
            ></div>
          </div>

          {/* 播放按钮 */}
          <div
            onClick={() => {
              console.log(
                "(pre + 1 > urls.length ? 0 : pre + 1)",
                index + 1 > audios.length ? 0 : index + 1
              );
              stop();
              setIndex((pre) => {
                play(true);
                return (pre + 1) % audios.length;
              }); //(pre + 1 >= urls.length ? 0 : pre + 1));
            }}
            className="shrink-0 rounded-full w-6 h-6 bg-teal-500 text-white text-sm flex items-center justify-center transition-all duration-500"
          >
            <Tooltip>
              <TooltipTrigger
                render={(props) => (
                  <span {...props}>
                    <SkipForward size={12} />
                  </span>
                )}
              ></TooltipTrigger>
              <TooltipContent>
                <p>切换下一首</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 播放按钮 */}
          <div
            onClick={playing ? stop : () => play()}
            className="shrink-0 rounded-full w-6 h-6 bg-teal-500 text-white text-xs flex items-center justify-center transition-all duration-500"
          >
            <Tooltip>
              <TooltipTrigger
                render={(props) => (
                  <span {...props}>
                    {playing ? <Pause size={12} /> : <Play size={12} />}
                  </span>
                )}
              ></TooltipTrigger>
              <TooltipContent>
                <p>播放/暂停</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {/* <button
        onClick={stop}
        className="rounded-full w-4 h-4 bg-gray-300  text-xs flex items-center justify-center"
      >
        ⏹
      </button> */}

        {/* <button
        onClick={toggleLoop}
        className={`px-3 py-1 rounded-lg ${
          loop ? "bg-teal-400 dark:bg-teal-600 text-white" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        {loop ? "循环开启" : "循环关闭"}
      </button> */}
      </GroundGlassCard>
    </div>
  );
};
