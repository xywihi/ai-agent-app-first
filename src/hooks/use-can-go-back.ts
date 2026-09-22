"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useCanGoBack() {
  const pathname = usePathname();
  const router = useRouter();
  const [historyStack, setHistoryStack] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHistoryStack((prev) => {
        // 避免重复压栈
        if (prev.at(-1) !== pathname) {
          return [...prev, pathname];
        }
        return prev;
      });
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  const canGoBack = historyStack.length > 1;

  const goBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return { canGoBack, goBack };
}
