import { useState } from "react";

// 处理时间格式
export function useTime(): [string, (currentTime: number | string) => void] {
  const [time, setTime] = useState<string>("");
  const setUpdateTime = (currentTime: number | string) => {
    const date = new Date(currentTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    setTime(
      `${year}-${month}-${day} ${hour < 10 ? "0" + hour : hour}:${
        minute < 10 ? "0" + minute : minute
      }:${second < 10 ? "0" + second : second}`
    );
  };
  return [time, setUpdateTime];
}
