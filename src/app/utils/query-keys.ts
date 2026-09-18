import { ProcessedPortfolioWork } from "./api/design/type";

export const QueryKeys = {
  // 用户中心
  userCenter: {
    data: ["user_data"] as const,
    signOut: ["sign_out"] as const,
    signIn: ["sign_in"] as const,
    signUp: ["sign_up"] as const,
    profiles: ["profiles"] as const,
    users: ["list_users"] as const,
  },
  // 前端笔记
  fronend: {
    new_notes: ["new_notes"] as const,
    visit: ["fontend_note_visit"] as const,
    rootCategories: (id?: string) =>
      ["fontend_note_root_categories", id] as const,
    note: (id: string) => ["fontend_notes", id] as const,
    notesAll: ["fontend_notes_all"] as const,
  },
  // 设计作品
  portfolio: {
    data: ["portfolio_data"] as const,

    categories: ["portfolio_categories"] as const,
    portfolios: (type: string) => ["portfolio_works", type] as const,
    portfoliosAll: ["portfolios_all"] as const,
    recomand: (work: ProcessedPortfolioWork) =>
      ["recomand_portfolios", work] as const,
    detail: (id: string) => ["portfolio_work_detail", id] as const,
  },
  // AI会话
  aiChat: {
    history: ["conver_histories"] as const,
    message: (id: string) => ["conver_messages", id] as const,
  },
  // AI代理
  // 公共
  public: {
    fuzzySearchAll: (keyValue: string) =>
      ["fuzzy_search_all", keyValue] as const,
  },
};
