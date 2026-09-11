"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
export const GlobalLoading = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [portalDom, setPortalDom] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const div = document.getElementById("global-loading");
    containerRef.current = div;
    // setIsLoading(true);
    //放进微任务
    queueMicrotask(() => {
      setPortalDom(div);
    });
  });
  if (!portalDom) return null;
  return (
    <div>
      {createPortal(
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900">
            <span className="bg-amber-300 px-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Loading...
            </span>
          </div>
        </div>,
        portalDom
      )}
    </div>
  );
};
