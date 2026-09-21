import { getFrontNotes } from "@/lib/data/notes";
import { getDefaultPortfolio } from "@/lib/data/portfolio";

export default async function sitemap() {
  // 查询全部作品
  const portfolios = await getDefaultPortfolio("all");
  const portfoliosUrls =
    portfolios?.list.map((item) => ({
      url: `https://ai-agent-app-first-7dk46qtlt-xywihis-projects.vercel.app/design/${item.id}`,
      lastModified: item.updated_at,
    })) || [];
  //查询全部笔记
  const notes = await getFrontNotes();
  const notesUrls =
    notes?.list.map((item) => ({
      url: `https://ai-agent-app-first-7dk46qtlt-xywihis-projects.vercel.app/frontend/${item.id}`,
      lastModified: item.updated_at,
    })) || [];
  return [
    {
      url: "https://ai-agent-app-first-7dk46qtlt-xywihis-projects.vercel.app",
      lastModified: new Date(),
    },
    ...notesUrls,
    ...portfoliosUrls,
  ];
}
