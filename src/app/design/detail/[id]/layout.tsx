import { getDefaultPortfolioB } from "@/lib/data/back/portfolio";
import { getDetailPortfolio } from "@/lib/data/portfolio/detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  // 请求数据库获取当前作品
  const portfolio = await getDetailPortfolio(id as string);
  return {
    title: portfolio?.title ?? "设计作品详情",
    description: portfolio?.description ?? "优秀的设计作品",
  };
}

export async function generateStaticParams() {
  const portfolios = await getDefaultPortfolioB("all");
  return portfolios?.list.map((p) => ({ id: p.id })) || [];
}
export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-start items-start p-4">
      <div className="flex-1">{children}</div>
    </div>
  );
}
