import { AsideNav } from "@/components/frontNote/AsideNav";
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
    <div className="min-h-screen xl:flex justify-between items-start p-4">
      <div className="hidden xl:block sticky top-22 min-w-80 ">
        <Suspense>
          <AsideNav />
        </Suspense>
      </div>
      <div className="flex-1 px-0 xl:px-40">{children}</div>
    </div>
  );
}
