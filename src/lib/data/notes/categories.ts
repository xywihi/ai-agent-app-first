import {
  CategoryItem,
  CategoryTree,
  Root,
} from "@/app/utils/api/font-notes/typs";
import server from "@/lib/server/server";
import { cookies } from "next/headers";

export const getNoteCategories = async () => {};

export async function getCategoryTree(userId: string) {
  const _cookie = await cookies();
  const supabase = await server(_cookie);
  const { data, error } = await supabase
    .from("note_categories")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  const { data: _noteData, error: _noteError } = await supabase
    .from("frontend_notes")
    .select("*");
  if (_noteError) throw new Error(_noteError.message);
  // 递归构建树，自动支持 1/2/3/N级
  const buildTree = (list: CategoryItem[]): CategoryTree => {
    const map = new Map<string, CategoryItem>();
    const tree: CategoryTree = { root: [], seconde: [] };
    const root: Root[] = [];
    const _seconde: CategoryItem[] = [];
    const seconde: CategoryItem[] = [];
    list.forEach((item) => {
      if (!item.parent_id) {
        root.push(item as Root);
      } else {
        _seconde.push(item);
      }
    });
    _seconde.forEach((item) => {
      if (item.type === "folder") {
        map.set(item.id as string, { ...item, children: [] });
      } else {
        map.set(item.id as string, item);
      }
    });
    map.forEach((item) => {
      if (item.children && _noteData) {
        _noteData.forEach((note) => {
          if (note.sub_category_id === item.id) {
            item.children!.push({
              name: note.title,
              id: note.id,
              parent_id: note.sub_category_id,
            });
          }
        });
      }
      if (item.parent_id) {
        const parent = map.get(item.parent_id);
        if (parent) {
          parent.children!.push(map.get(item.id as string)!);
        } else {
          seconde.push(item);
        }
      }
    });
    tree.root = root;
    tree.seconde = seconde;
    return tree;
  };
  return buildTree(data);
}
