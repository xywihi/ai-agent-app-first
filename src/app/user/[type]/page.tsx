"use client";
import Frontend from "@/components/user/contents/Frontend";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function User() {
  const params = useParams();
  const currentContent = useMemo(() => {
    switch (params.type) {
      case "frontend":
        return <Frontend />;
        break;

      default:
        break;
    }
  }, [params.type]);
  return <div>{currentContent}</div>;
}
