import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 防抖函数
export const debounce = <T extends <T>(...args: T[]) => void>(
  fn: <T>(...args: T[]) => void,
  delay: number
) => {
  let timer: NodeJS.Timeout;
  return (
    fnn: <T extends <T>(...args: T[]) => T>(...args: T[]) => void,
    ...args: T[]
  ) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("防抖", args, fn);
      fn(fnn, ...args);
    }, delay);
  };
};

// 处理日期格式
export function getDateTime(currentTime: number | string): string {
  const date = new Date(currentTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${year}-${month}-${day} ${hour < 10 ? "0" + hour : hour}:${
    minute < 10 ? "0" + minute : minute
  }`;
}

//处理时间格式
export function getTime(currentTime: number | string): string {
  const date = new Date(currentTime);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${month}月${day}日 ${hour < 10 ? "0" + hour : hour}:${
    minute < 10 ? "0" + minute : minute
  }`;
}
