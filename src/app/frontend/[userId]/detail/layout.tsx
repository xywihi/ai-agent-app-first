import { AsideNav } from "@/components/frontNote/AsideNav";
import { MobileAsideNav } from "@/components/frontNote/MobileAsideNav";
import { Suspense } from "react";

export default async function FrontendDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen xl:flex justify-between items-start md:p-4">
      <Suspense>
        <div className="xl:hidden">
          <MobileAsideNav />
        </div>
        <div className="hidden xl:block">
          <AsideNav />
        </div>
      </Suspense>
      <div className="flex-1 px-0 xl:px-40">{children}</div>
    </div>
  );
}
