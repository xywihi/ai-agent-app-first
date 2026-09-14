"use client";
import { createPortal } from "react-dom";
import { JSX, useEffect, useRef, useState } from "react";
import { useScrollLock } from "@/hooks/use-scroll-lock";
export const GlobalModel = ({
  children,
  handleShowModel,
}: {
  children?: JSX.Element;
  handleShowModel?: () => void;
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [portalDom, setPortalDom] = useState<HTMLElement | null>(null);
  useScrollLock(true);
  useEffect(() => {
    const div = document.getElementById("global-loading");
    containerRef.current = div;
    // setIsLoading(true);
    //放进微任务
    queueMicrotask(() => {
      setPortalDom(div);
    });
  });
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
  };
  if (!portalDom) return null;
  return (
    <div>
      {createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center z-100 bg-gray-600/80"
          onClick={handleShowModel}
        >
          <div className="w-3/5 flex flex-col" onClick={handleClick}>
            {children}
          </div>
        </div>,
        portalDom
      )}
    </div>
  );
};
