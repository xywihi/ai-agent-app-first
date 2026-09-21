export const metadata = {
  title: "设计作品集",
  description: "查看设计作品，效果图。",
  keywords: "UI设计,网页设计,作品集",
  openGraph: {
    // 用于分享
    title: "我的作品集",
    description: "查看设计作品",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "我的作品集",
    description: "查看设计作品",
  },
  icons: {
    shortcut: "/favicon.ico",
  },
};

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
