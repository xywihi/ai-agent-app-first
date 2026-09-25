import { AsideNav } from "@/components/frontNote/AsideNav";
import { MobileAsideNav } from "@/components/frontNote/MobileAsideNav";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "前端笔记",
  description: "查看前端笔记。",
  keywords: "前端笔记，前端开发，技术笔记",
  openGraph: {
    // 用于分享
    title: "我的前端笔记",
    description: "查看前端笔记",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "我的前端笔记",
    description: "浏览前端开发相关笔记",
  },
  icons: {
    shortcut: "/favicon.ico",
  },
};

export default async function FrontendLayout({
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
