"use client";

import { useState, useCallback } from "react";

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    setCopied(false);
    try {
      await navigator.clipboard.writeText(text); //复制到剪贴板
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);
  return {
    copied,
    copyToClipboard,
  };
};
