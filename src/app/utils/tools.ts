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
