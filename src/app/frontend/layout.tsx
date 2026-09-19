import { AsideNav } from "@/components/frontNote/AsideNav";
import { Suspense } from "react";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen xl:flex justify-between items-start p-4">
      <div className="hidden xl:block">
        <Suspense>
          <AsideNav />
        </Suspense>
      </div>

      <div className="flex-1 px-4 xl:px-40">{children}</div>
    </div>
  );
}
