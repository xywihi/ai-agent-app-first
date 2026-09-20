import { Icon } from "@/components/Icon";
import z from "zod";

export interface Note {
  id?: string;
  title: string; // 标题
  category_id: string; // 分类
  sub_category_id: string; // 子分类
  sort_order?: number; // 排序
  content?: string; // 内容
  summary?: string; // 摘要
  is_published?: boolean; // 是否发布
  view_count?: number; // 阅读量
  created_at?: string; // 创建时间
  updated_at?: string; // 更新时间
  owner_id?: string; // 所属用户
  note_categories?: CategoryItem;
}

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export const CategoriesSchema = z.array(CategorySchema);

export type CategoryItem = {
  id?: string;
  parent_id: string | null;
  name: string;
  icon_name?: Parameters<typeof Icon>[0]["name"] | null;
  type?: string;
  sort_order?: number;
  children?: CategoryItem[];
};
export type Root = {
  id: string;
  parent_id?: string;
  name: string;
  type?: string;
  icon_name?: Parameters<typeof Icon>[0]["name"];
  sort_order?: number;
};
export type CategoryTree = {
  root: Root[];
  seconde: CategoryItem[];
};
