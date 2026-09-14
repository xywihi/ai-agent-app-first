"use client";
import { useEffect } from "react";

export function useScrollLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    // 保存body原始样式
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;

    // 锁定滚动，填充滚动条宽度，防止页面抖动
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      // 关闭时恢复原样
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open]);
}
