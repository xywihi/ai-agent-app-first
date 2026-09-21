import { ProjectSummary } from "@/components/ProjectSummary";
import { HomeHero } from "./components/HomeHero";
import { PortfolioSection } from "./components/PortfolioSection";
import { NotesSection } from "./components/NotesSection'";
import { AISection } from "./components/AISection";
import { getDefaultPortfolio } from "@/lib/data/portfolio";
import { getFrontNotes } from "@/lib/data/notes";
export default async function Chat() {
  const [portfolios_data, frontnotes_data] = await Promise.all([
    getDefaultPortfolio("all"),
    getFrontNotes(),
  ]);
  console.log("frontnotes_data", frontnotes_data);
  return (
    // <div className="flex-1 flex flex-col justify-between items-center bg-linear-to-br from-white via-slate-50 to-zinc-50">
    <div className="flex-1 flex flex-col justify-between items-center pb-46">
      {/* 头部 */}
      <HomeHero />
      <div className="flex-1 flex flex-col 2xl:flex-row justify-center items-center gap-8">
        {/* 作品集 */}
        <PortfolioSection data={portfolios_data} />
        {/* 前端笔记 */}
        <NotesSection data={frontnotes_data} />
        {/* AI */}
        <AISection />
      </div>
      {/* 项目总结 */}
      <ProjectSummary />
    </div>
  );
}
