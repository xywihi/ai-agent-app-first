"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/design/all");
  }, []);
  return <div>{children}</div>;
}
