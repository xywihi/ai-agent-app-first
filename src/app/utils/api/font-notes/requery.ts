import { createClient } from "@/lib/server/client";
import { createClient as createSupabase } from "@supabase/supabase-js";
import { CategoryItem, CategoryTree, Note, Root } from "./typs";
import { reportErrorLog } from "@/lib/reportError";
// 记录笔记访问
export async function recordNoteVisit(noteId: string) {
  const client = createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  const userId = user?.id;
  console.log("user", user);
  // 游客：每次访问直接记录，不做去重
  if (!userId) {
    await client.from("frontend_note_visits").insert([{ note_id: noteId }]);
    return [];
  }

  // 登录用户：查询今日是否已有访问记录
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { data } = await client
    .from("frontend_note_visits")
    .select("id")
    .eq("note_id", noteId)
    .eq("user_id", userId)
    .gte("visited_at", todayStart.toISOString())
    .limit(1);

  // 今天没有访问记录，才插入
  if (data && data.length === 0) {
    await client
      .from("frontend_note_visits")
      .insert([{ note_id: noteId, user_id: userId }]);
    return [];
  } else {
    console.log("今日已有访问记录");
    return [];
  }
}
//获取笔记类别
export async function getNoteSecondCategories(
  currentRootId: string | null = null
) {
  const client = createClient();
  if (!currentRootId) {
    return [];
  }
  const { data } = await client
    .from("note_categories")
    .select("*")
    .eq("parent_id", currentRootId)
    .order("sort_order", { ascending: true });
  console.log("data", data);
  return data;
}
export async function getCategoryTree() {
  const client = createClient();
  const { data, error } = await client
    .from("note_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const { data: _noteData } = await client.from("frontend_notes").select("*");

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
// 获取笔记访问记录
export async function getNoteVisits(noteId: string) {
  const client = createClient();
  const { data } = await client
    .from("frontend_note_visits")
    .select("*")
    .eq("note_id", noteId);
  return data;
}

// 新增笔记
export async function addNote(note: Note) {
  const client = createClient();
  try {
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error) {
      throw error;
    }
    const { data } = await client
      .from("frontend_notes")
      .insert({ ...note, owner_id: user?.id });
    return data;
  } catch (error) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_add_note_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}

// 查询笔记
export async function getNote(noteId: string) {
  const client = createClient();
  const { data } = await client
    .from("frontend_notes")
    .select("*")
    .eq("id", noteId)
    .single();
  return data;
}

// 新增类别
export async function addCategory(category: CategoryItem) {
  const client = createClient();
  try {
    const { data } = await client.from("note_categories").insert(category);
    return data;
  } catch (error) {
    console.log("chat api error", error);
    await reportErrorLog({
      errorType: "api_add_category_error",
      error,
    });
    return new Response(JSON.stringify({ error: "服务异常", data: null }), {
      status: 500,
    });
  }
}
