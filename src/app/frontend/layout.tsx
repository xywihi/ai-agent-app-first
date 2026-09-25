export const metadata = {
  title: "前端笔记",
  description: "拥有前端笔记的用户列表",
  keywords: "前端笔记，前端开发，技术笔记",
  openGraph: {
    // 用于分享
    title: "前端笔记",
    description: "拥有前端笔记的用户列表",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "前端笔记",
    description: "拥有前端笔记的用户列表",
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
  return children;
}
