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
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "@/app/utils/api/font-notes/requery";
import z, { set } from "zod";
import { Suspense, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Icon } from "../../Icon";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const formSchema = z.object({
  title: z.string().min(2, {
    message: "标题至少2个字",
  }),
  description: z.string(),
  path: z.string(),
  key_name: z.string(),
  icon_name: z.string(),
});
type FormValues = z.infer<typeof formSchema>;
export const CreateCategory = ({
  grade,
  parent_id = null,
}: {
  grade: number;
  parent_id?: string | null;
}) => {
  const {
    register,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      path: "",
      key_name: "",
      icon_name: "computer",
    },
    mode: "onTouched",
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
    mutationFn: async (category: FormValues) => {
      const data = await fetch("/api/user/design/portfolio/categories", {
        method: "POST",
        body: JSON.stringify({ category }),
      });
      return data;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        queryKey: ["portfolio_categories"],
      });
      toast.success("创建成功", {
        position: "top-center",
        style: { backgroundColor: "white" },
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
        <form
          target="_blank1"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            handleSubmit((data) => {
              handleAddCategory(data);
            })();
          }}
        >
          <DialogHeader>
            <DialogTitle>新增{!grade ? "一级" : "二级"}类型</DialogTitle>

            <Input
              placeholder="输入类名"
              className="my-2"
              {...register("title")}
            />
            <Input
              placeholder="输入描述"
              className="my-2"
              {...register("description")}
            />
            <Input
              placeholder="输入路径"
              className="my-2"
              {...register("path")}
            />
            <Input
              placeholder="输入关键字"
              className="my-2"
              {...register("key_name")}
            />
            {!grade && (
              <Select
                // onValueChange={(e) =>
                //   setCategory((pre) => ({
                //     ...pre,
                //     icon_name: e as Parameters<typeof Icon>[0]["name"],
                //   }))
                // }
                // {...register("icon_name")}
                defaultValue={"computer"}
                onValueChange={(e: string | null) => {
                  setValue("icon_name", e as string);
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <Suspense>
                    <Icon
                      name={
                        getValues("icon_name") as Parameters<
                          typeof Icon
                        >[0]["name"]
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
            <Button type="submit" formTarget="_blank1" className="bg-teal-400">
              保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
