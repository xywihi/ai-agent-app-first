"use client";

import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}
export function MovingBorder({ children, className, innerClassName }: Props) {
  return (
    <div className={cn(`relative p-px overflow-hidden rounded-lg`, className)}>
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-teal-500 to-transparent animate-border-lr" />
      <div
        className={cn(
          "relative bg-teal-200 border border-teal-300 dark:bg-zinc-900 px-4 py-2 rounded-lg",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
