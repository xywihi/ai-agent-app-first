"use client";
import { Copy, CopyCheck } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}
export function CopyButton({ text, className }: CopyButtonProps) {
  const { copied, copyToClipboard } = useCopyToClipboard();
  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      console.log("复制成功");
      toast.success("复制成功", {
        position: "top-center",
        style: {
          backgroundColor: "#00d5be",
          borderRadius: "8px",
        },
      });
    }
  };

  return (
    <Button
      className={cn(
        className,
        "cursor-pointer hover:bg-teal-400 dark:bg-teal-600"
      )}
      onClick={handleCopy}
    >
      {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
    </Button>
  );
}
