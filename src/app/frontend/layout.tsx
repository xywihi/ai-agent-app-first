import { AsideNav } from "@/components/frontNote/AsideNav";
import { Suspense } from "react";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex justify-between items-start p-4">
      <Suspense>
        <AsideNav />
      </Suspense>
      <div className="flex-1 px-40">{children}</div>
    </div>
  );
}
