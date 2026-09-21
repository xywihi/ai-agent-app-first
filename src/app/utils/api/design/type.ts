import { Profiles } from "../user/type";

//分类
export type PortfolioCategory = {
  id: string;
  user_id: string;
  icon_name: string | null;
  title: string;
  description: string | null;
  total_count: number;
  path: string;
  key_name: string;
  sort_order: number;
  created_at: string;
};

//作品
export type PortfolioWork = {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  tags: string[];
  like_count: number;
  collect_count: number;
  share_count: number;
  is_published: boolean;
  updated_at: string;
};
//作品点赞
type PortfolioLikes = {
  id: string;
  user_id: string;
  work_id: string;
  created_at: string;
};
// 作品收藏
type PortfolioCollects = {
  id: string;
  user_id: string;
  work_id: string;
  created_at: string;
};
// 处理后的作品
export type ProcessedPortfolioWork = PortfolioWork & {
  portfolio_work_images: PortfolioWorkImage[];
  portfolio_categories: PortfolioCategory;
  portfolio_work_likes: PortfolioLikes[];
  portfolio_work_collects: PortfolioCollects[];
  author: Profiles;
  actions: {
    like: {
      count: number;
      active: boolean;
    };
    star: {
      count: number;
      active: boolean;
    };
    share: {
      count: number;
    };
  };
};
//作品图片
export type PortfolioWorkImage = {
  id: string;
  work_id: string;
  image_url: string;
  sort_order: number;
};
