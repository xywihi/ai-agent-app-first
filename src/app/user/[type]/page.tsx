"use client";
import Design from "@/components/user/contents/Design";
import Frontend from "@/components/user/contents/Frontend";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function User() {
  const params = useParams();
  const currentContent = useMemo(() => {
    switch (params.type) {
      case "ui":
        return <Design />;
      case "frontend":
        return <Frontend />;

      default:
        break;
    }
  }, [params.type]);
  return (
    <div>
      <div>{currentContent}</div>
    </div>
  );
}
