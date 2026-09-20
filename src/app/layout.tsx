import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProviders from "@/components/QueryProviders";
import { MusicPlayer } from "@/components/MusicPlayer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeaderNav } from "@/components/HeaderNav";
import { MobileSheetNav } from "@/components/MobileSheetNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "夕夜 · 前端开发/UI设计/AI Agent",
  description:
    "个人作品集，展示 UI 设计、前端开发、技术笔记以及 AI Agent 全栈项目。",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* <body className="h-screen flex flex-col justify-between bg-white dark:bg-gray-700 bg-[radial-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb,transparent)]! bg-size-[24px_24px]!"> */}
      <body>
        <div
          id="global_anln"
          className="h-screen flex flex-col justify-between bg-white dark:bg-gray-700 bg-[radial-gradient(#b1cacb_1px,transparent_1px)]! dark:bg-[radial-gradient(#32393a_1px,transparent_1px)]! bg-size-[24px_24px]!"
        >
          <div className="flex-1 flex flex-col justify-between items-center bg-linear-to-br from-transparent via-35% to-[white] dark:to-[black]">
            <QueryProviders>
              <TooltipProvider>
                <>
                  <header className="fixed z-90 top-0 w-full p-4 max-h-24 bg-white dark:bg-gray-700/40 border-b border-white/40 dark:border-black/40 backdrop-blur-md shadow-xl shadow-[#d3d5d848] dark:shadow-[#2e2f2f48]">
                    <MobileSheetNav />
                    <HeaderNav />
                  </header>

                  <main className="w-full mt-18">
                    <div id="global-loading"></div>
                    {children}
                    {/* sonner 提示 */}
                    <Toaster className="bg-white dark:bg-gray-700" />
                  </main>
                  <footer className="w-full">
                    <div className="w-full py-8 bg-white dark:bg-gray-700 shadow-xl  drop-shadow-[0_-4px_12px_#d3d5d848] dark:drop-shadow-[0_-4px_12px_#2e2f2f48] border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-400">
                      <p>©2026 个人作品集 · Next.js + TailwindCSS 构建</p>
                    </div>
                  </footer>
                </>
              </TooltipProvider>
            </QueryProviders>
          </div>
        </div>
        {/* 音乐播放器 */}
        <MusicPlayer className="fixed z-90 bottom-6 right-6" />
      </body>
    </html>
  );
}
