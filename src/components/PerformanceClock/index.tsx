"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { AlarmClock, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { ButtonGroup } from "../ui/button-group";
import { clear } from "console";
import useAudio from "@/hooks/use-audio";

interface Time {
  sec: string;
  min: string;
  hour: string;
  day: string;
  mounth: string;
  year: string;
}
export default function PerformanceClock() {
  const rafIdRef = useRef<number>(0);
  const [time, setTime] = useState<Time>({
    sec: "0",
    min: "0",
    hour: "0",
    day: "0",
    mounth: "0",
    year: "0",
  });
  const [shakeClock, setShakeClock] = useState(false);
  const [clockOpened, setClockOpened] = useState(false);
  // const [shakeTime, setShakeTime] = useState<number | null>(null);
  const shakeTimeRef = useRef<number | null>(null);
  const clockTimer = useRef<NodeJS.Timeout | null>(null);
  const { play, stop, setLoopMode } = useAudio("/audio/alarmClock.wav");
  function updateClock(currentclockOpened?: boolean) {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hour = now.getHours();
    queueMicrotask(() => {
      setTime({
        sec: sec > 9 ? `${sec}` : `0${sec}`,
        min: min > 9 ? `${min}` : `0${min}`,
        hour: hour > 9 ? `${hour}` : `0${hour}`,
        day: now.getDate() > 9 ? `${now.getDate()}` : `0${now.getDate()}`,
        mounth:
          now.getMonth() + 1 > 9
            ? `${now.getMonth() + 1}`
            : `0${now.getMonth() + 1}`,
        year:
          now.getFullYear() > 9
            ? `${now.getFullYear()}`
            : `0${now.getFullYear()}`,
      });
      // console.log(
      //   "clockOpened",
      //   currentclockOpened,
      //   clockTimer.current,
      //   currentclockOpened &&
      //     shakeTimeRef.current &&
      //     now.getTime() > shakeTimeRef.current &&
      //     !clockTimer.current
      // );

      if (
        currentclockOpened &&
        shakeTimeRef.current &&
        now.getTime() > shakeTimeRef.current &&
        !clockTimer.current
      ) {
        setShakeClock(true);
        setLoopMode(true);
        play();

        clockTimer.current = setTimeout(() => {
          clearTimeout(clockTimer.current as NodeJS.Timeout);
          setShakeClock(false);
          shakeTimeRef.current = null;
          console.log("clockTimer.current", clockTimer.current);
          setClockOpened(false);
          stop();
        }, 10000);
      }
    });
  }

  const handleShakeClock = (second: number = 0) => {
    if (shakeClock) return;
    const now = new Date(
      time.year +
        "-" +
        time.mounth +
        "-" +
        time.day +
        " " +
        time.hour +
        ":" +
        time.min +
        ":" +
        time.sec
    );
    //10秒钟后
    const shakeTime = now.getTime() + 10000;
    console.log(
      time.hour + ":" + time.min + ":" + time.sec,
      "shakeTime",
      shakeTime,
      now.getSeconds(),
      now.getSeconds() + second
    );
    // setShakeTime(shakeTime);
    shakeTimeRef.current = shakeTime;
    setClockOpened(true);
  };
  const handleStopClock = () => {
    setClockOpened(false);
    setShakeClock(false);
    // setShakeTime(null);
    shakeTimeRef.current = null;
    clearTimeout(clockTimer.current as NodeJS.Timeout);
    stop();
  };
  useEffect(() => {
    let lastSecond = -1;
    function tick() {
      // 页面不可见直接跳过，降功耗
      if (document.hidden) {
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }
      const now = new Date();
      const currentSec = now.getSeconds();
      // 只在秒发生变化时更新DOM，避免每一帧都操作DOM
      if (currentSec !== lastSecond) {
        lastSecond = currentSec;
        updateClock(clockOpened);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    }

    // 初始化一次
    updateClock(clockOpened);
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
      clearTimeout(clockTimer.current as NodeJS.Timeout);
    };
  }, [clockOpened]);
  return (
    <HoverCard>
      <HoverCardTrigger delay={0} closeDelay={0}>
        <Button
          className={cn(
            "p-2 backdrop-blur-md border-gray-200 rounded-lg  hover:text-teal-400 cursor-pointer",
            shakeClock ? "animate-clock-shake" : ""
          )}
        >
          <div className="flex items-center gap-1">
            <Clock />
            {time.hour}:{time.min}:{time.sec}
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        alignOffset={(offeset) => {
          return (offeset.anchor.width - offeset.positioner.width) / 2;
        }}
        className="flex flex-col bg-white w-fit"
      >
        {!clockOpened ? (
          <div>
            <div className="mb-2">设置闹钟倒计时：</div>
            <ButtonGroup>
              <Button
                className="hover:text-teal-400 cursor-pointer border-gray-200"
                variant="outline"
                onClick={() => handleShakeClock(10)}
              >
                30秒
              </Button>
              <Button
                className="hover:text-teal-400 cursor-pointer border-gray-200"
                variant="outline"
                onClick={() => handleShakeClock(30 * 60)}
              >
                半小时
              </Button>
              <Button
                className="hover:text-teal-400 cursor-pointer border-gray-200"
                variant="outline"
                onClick={() => handleShakeClock(60 * 60)}
              >
                一小时
              </Button>
            </ButtonGroup>
          </div>
        ) : (
          <Button
            onClick={handleStopClock}
            className={"hover:text-teal-400 cursor-pointer border-gray-200"}
          >
            停止当前闹钟 <AlarmClock />
          </Button>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
