import {
  BookMarked,
  Bot,
  Computer,
  Cpu,
  Globe,
  Monitor,
  PanelsTopLeft,
  Plus,
  Presentation,
  Sparkle,
  Toolbox,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "@/app/utils/api/font-notes/requery";
import { set } from "zod";
import { Suspense, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Icon } from "../Icon";
import { toast } from "sonner";

export const CreateCategory = ({
  grade,
  parent_id = null,
}: {
  grade: number;
  parent_id?: string | null;
}) => {
  const [category, setCategory] = useState<{
    name: string;
    icon_name: Parameters<typeof Icon>[0]["name"];
    parent_id: string | null;
  }>({
    name: "",
    icon_name: "computer",
    parent_id: parent_id,
  });
  const queryClient = useQueryClient();
  const iconNames = useMemo(() => {
    return [
      {
        name: "computer",
        icon: <Computer size={20} />,
      },
      {
        name: "cpu",
        icon: <Cpu size={20} />,
      },
      {
        name: "globe",
        icon: <Globe size={20} />,
      },
      {
        name: "monitor",
        icon: <Monitor size={20} />,
      },
      {
        name: "book-marked",
        icon: <BookMarked size={20} />,
      },
      {
        name: "wrench",
        icon: <Wrench size={20} />,
      },
      {
        name: "toolbox",
        icon: <Toolbox size={20} />,
      },
      {
        name: "panels-top-left",
        icon: <PanelsTopLeft size={20} />,
      },
      {
        name: "bot",
        icon: <Bot size={20} />,
      },
      {
        name: "presentation",
        icon: <Presentation size={20} />,
      },
      {
        name: "sparkle",
        icon: <Sparkle size={20} />,
      },
    ];
  }, []);
  const {
    mutate: handleAddCategory,
    isPending,
    isError,
  } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fontendNoteRootCategories"],
      });
      toast.success("创建成功", { position: "top-center" });
      setCategory({
        name: "",
        icon_name: "computer",
        parent_id: parent_id,
      });
    },
    onError: () => {},
  });
  return (
    <Dialog>
      <DialogTrigger className="px-2 flex justify-between items-center w-full bg-gray-300 hover:bg-teal-400">
        新增{!grade ? "一级" : "二级"}类型
        <Plus size={20} />
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>新增{!grade ? "一级" : "二级"}类型</DialogTitle>
          <Input
            name="roo_category"
            placeholder="输入类名"
            className="my-4"
            onChange={(e) =>
              setCategory((pre) => ({ ...pre, name: e.target.value }))
            }
          />
          {!grade && (
            <Select
              onValueChange={(e) =>
                setCategory((pre) => ({
                  ...pre,
                  icon_name: e as Parameters<typeof Icon>[0]["name"],
                }))
              }
            >
              <div className="flex flex-row items-center gap-2">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <Suspense>
                  <Icon
                    name={
                      category.icon_name as Parameters<typeof Icon>[0]["name"]
                    }
                    size={20}
                  />
                </Suspense>
              </div>

              <SelectContent className="bg-white min-w-90 max-h-40 overflow-auto">
                <SelectGroup>
                  {iconNames.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.name}</span>
                        {item.icon}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </DialogHeader>
        <DialogFooter className="sm:justify-start border-gray-300">
          <DialogClose>
            <span>关闭</span>
          </DialogClose>
          <Button
            type="submit"
            className="bg-teal-400"
            onClick={() => {
              handleAddCategory({
                name: category.name,
                icon_name: !grade ? category.icon_name : null,
                parent_id: category.parent_id,
                type: "folder",
              });
            }}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
