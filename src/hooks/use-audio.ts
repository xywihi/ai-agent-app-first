"use client";
import { useRef, useEffect, useState } from "react";

export default function useAudio(src: string, onSongend?: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 记录循环状态，用于UI展示开关
  const [loop, setLoop] = useState(false);
  // 记录播放状态
  const [playing, setPlaying] = useState(false);
  //记录进度
  const [progress, setProgress] = useState(0);
  //记录总时间
  const [duration, setDuration] = useState(0);

  // 更新循环状态：修改state + 修改audio实例
  const setLoopMode = (enable: boolean) => {
    setLoop(enable);
    if (audioRef.current) {
      audioRef.current.loop = enable;
    }
  };

  const play = async (replay?: boolean, _src?: string) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (replay) {
      stop();
      audio.currentTime = 0;
      audio.src = _src || src;
      // 等待loadedmetadata事件再play（最稳）
      // 设置src后，不要立刻play；等待音频加载元数据完成再调用play
      try {
        // 等待元数据加载完成
        await new Promise<void>((resolve, reject) => {
          const onReady = () => {
            audio.removeEventListener("loadedmetadata", onReady);
            audio.removeEventListener("error", onError);
            resolve();
          };
          const onError = (ev: Event) => {
            audio.removeEventListener("loadedmetadata", onReady);
            audio.removeEventListener("error", onError);
            reject(ev);
          };
          audio.addEventListener("loadedmetadata", onReady);
          audio.addEventListener("error", onError);
        });

        await audio.play();
      } catch (e: unknown) {
        if (e instanceof Error) {
          if (e.name !== "AbortError") {
            console.warn("音频异常", e);
          }
        }
      }
    } else {
      await audio.play();
    }
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    // audioRef.current.currentTime = 0;
  };

  const toggleLoop = () => {
    setLoopMode(!loop);
  };
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.src = src;
    audioRef.current.preload = "auto";
    // 将state同步到audio实例
    audioRef.current.loop = loop;
    // 监听进度
    audioRef.current.ontimeupdate = () => {
      setProgress(audioRef.current!.currentTime);
    };
    // 监听播放状态
    audioRef.current.onplaying = () => {
      setPlaying(true);
    };
    audioRef.current.onpause = () => {
      setPlaying(false);
    };
    // 监听播放结束
    audioRef.current.onended = () => {
      setPlaying(false);
      console.log("播放结束", onSongend);
      if (onSongend) onSongend();

      play(true);
    };
    //记录总时间
    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current!.duration);
    };
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = src;
    }
  }, [src]);
  return {
    play,
    stop,
    loop,
    playing,
    progress,
    duration,
    setLoopMode,
    toggleLoop,
  };
}
