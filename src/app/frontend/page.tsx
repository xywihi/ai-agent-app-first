import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getNoteUserList } from "@/lib/data/notes/user-list";
import { Note, NoteUser } from "../utils/api/font-notes/typs";
import Link from "next/link";
import { Eye, Notebook } from "lucide-react";

export default async function Page() {
  const noteUserList: NoteUser[] = await getNoteUserList();
  console.log("note_user_list", noteUserList);
  if (!noteUserList) return null;
  return (
    <div className="flex flex-col min-h-screen gap-4">
      {/* 笔记用户 */}
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">拥有笔记的用户</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {noteUserList.map((item: NoteUser) => (
            <Card
              key={item.id}
              className="flex flex-col gap-4 bg-white dark:bg-gray-700 shadow-xl"
            >
              <div className="px-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <Link href={`/frontend/${item.id}/detail`}>
                      <AvatarImage
                        src={item.avatar_url}
                        alt={item.display_name}
                        className="object-cover"
                      />
                    </Link>
                  </Avatar>
                  <div>
                    <p className="text-lg font-bold">{item.display_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 ">
                  <Notebook size={18} />
                  <span className="text-md">{item.count}</span>
                </div>
              </div>
              <CardContent>
                {item.bio && (
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {item.bio}
                  </p>
                )}
              </CardContent>
              <CardFooter className="border-gray-200 dark:border-gray-600">
                {item.frontend_notes.map((note: Note) => (
                  <Link
                    href={`/frontend/${item.id}/detail/${note.id}`}
                    key={note.id}
                    className="w-full flex justify-between items-center gap-4 text-gray-400 "
                  >
                    <span className="truncate text-sm underline hover:text-teal-400 dark:hover:text-teal-600">
                      {note.title}
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Eye size={14} />
                      {note.view_count}
                    </span>
                  </Link>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
