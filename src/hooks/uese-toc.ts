"use client";
import { useEffect, useState } from "react";

export type TocItem = {
  id: string;
  title: string;
  level: number;
};

export function useToc(containerSelector: string, note_id: string) {
  const [list, setList] = useState<TocItem[]>([]);

  useEffect(() => {
    function collectHeadings() {
      const box = document.querySelector(containerSelector);
      if (!box) return [];
      const headingNodes = Array.from(box.querySelectorAll("h1, h2, h3"));
      const items: TocItem[] = headingNodes.map((el) => ({
        id: el.id,
        title: el.textContent ?? "",
        level: Number(el.tagName.replace("H", "")),
      }));
      return items;
    }

    // 延时等待markdown渲染完毕
    const timer = setTimeout(() => {
      setList(collectHeadings());
    }, 1220);

    return () => clearTimeout(timer);
  }, [containerSelector, note_id]);

  return list;
}
