import {
  CategoryItem,
  CategoryTree,
  Note,
} from "@/app/utils/api/font-notes/typs";
import { ChatMarkDown } from "../ChatMarkDown";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Textarea } from "../ui/textarea";
import { CreateCategory } from "./CreateCategory";
import { Input } from "../ui/input";
import {
  addNote,
  getNoteSecondCategories,
  updateNote,
} from "@/app/utils/api/font-notes/requery";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";
import { id } from "zod/v4/locales";
import { QueryKeys } from "@/app/utils/query-keys";
import { NotebookPen } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "标题至少2个字",
  }),
  content: z.string().min(1, {
    message: "文章内容不能为空",
  }),
  root: z.object({
    id: z.string(),
    name: z
      .string()
      .min(1, {
        message: "此分类为必选",
      })
      .optional(),
  }),
  seconde: z.object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, {
        message: "此分类为必选",
      })
      .optional(),
  }),
});
type FormData = z.infer<typeof formSchema>;

export const EditeNoteForm = ({
  root_category,
  note_data,
  setEditable,
}: {
  root_category: CategoryTree;
  note_data?: Note;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    resetField,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note_data?.title,
      content: note_data?.content,
      root: { id: "", name: "" },
      seconde: { id: "", name: "" },
    },
  });
  const currentContent = watch("content");
  useEffect(() => {
    const default_root = root_category?.root.filter((item) => {
      if (item.id === note_data?.category_id) {
        return item;
      }
    });
    const default_seconde = root_category?.seconde.filter((item) => {
      if (item.id === note_data?.sub_category_id) {
        return item;
      }
    });
    setValue("root", default_root[0]);
    setValue("seconde", default_seconde[0]);
  }, [note_data, root_category, setValue]);
  const root_second = useWatch({
    control,
    name: ["root", "seconde"],
  });
  // 提交编辑笔记表单
  const onSubmit = async (data: FormData, noteId: string | null) => {
    const newNote = {
      title: data.title,
      category_id: data.root.id,
      sub_category_id: data.seconde.id as string,
      sort_order: 0,
      content: data.content.replaceAll("\\n", "\n").replaceAll("\t", ""),
      summary: "",
      is_published: false,
    };
    console.log("newNote", newNote);
    try {
      if (!noteId) {
        // 创建新的笔记
        const res = await addNote({ ...newNote });
        if (res?.status !== 200) {
          toast.error("创建失败", {
            position: "top-center",
            className: "bg-red-400 text-white dark:bg-red-600",
          });
          return;
        }
      } else {
        //更新笔记
        const res = await updateNote({ ...newNote, id: noteId });
        if (res?.status !== 200) {
          toast.error("更新失败", {
            position: "top-center",
            className: "bg-red-400 text-white dark:bg-red-600",
          });
          return;
        }
      }

      // 重置表单
      reset();
      // 更新笔记列表
      // refetch();
      // 滚动到顶部
      window.scrollTo(0, 0);
      setEditable(false);
      // 更新(刷新)笔记列表请求
      queryClient.refetchQueries({
        queryKey: QueryKeys.fronend.rootCategories(),
      });
      toast.success("创建成功", {
        position: "top-center",
        className: "bg-teal-400 text-white dark:bg-teal-600",
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <form
      action=""
      onSubmit={handleSubmit((data) => onSubmit(data, note_data?.id ?? null))}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="flex gap-2 items-center mb-4 border-gray-300 dark:border-gray-600 text-2xl font-bold">
            <NotebookPen />
            {note_data ? "编辑" : "创建新的"}笔记
          </FieldLegend>
          <hr className="border-gray-300" />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="note-title" className="text-xl">
                笔记标题
              </FieldLabel>
              <Input
                id="note-title"
                placeholder="请输入笔记标题"
                // required
                className="h-10"
                {...register("title")}
              />
              <FieldError className="text-red-500">
                {errors.title?.message}
              </FieldError>
            </Field>
            <div className="flex gap-4">
              <Field>
                <FieldLabel htmlFor="note-framework" className="text-xl">
                  一级类型
                </FieldLabel>
                <Combobox
                  items={root_category && (root_category as CategoryTree)?.root}
                >
                  {/* {!note_data && (
                      <ComboboxInput
                        placeholder="选在一级类型"
                        required
                        // id="note-framework"
                      />
                    )} */}

                  {!root_second[0] ? (
                    <ComboboxInput
                      placeholder="选择一级类型"
                      required
                      // id="note-framework"
                    />
                  ) : (
                    <ComboboxInput
                      placeholder="选择一级类型"
                      required
                      value={root_second[0]?.name}
                      // id="note-framework"
                    />
                  )}
                  <FieldError className="text-red-500">
                    {errors.root?.message}
                  </FieldError>
                  <ComboboxContent className="bg-white dark:bg-gray-700">
                    <ComboboxEmpty>新增一级类型</ComboboxEmpty>
                    <ComboboxList>
                      {/* <ComboboxItem>一级类型</ComboboxItem> */}
                      {(item) => (
                        <ComboboxItem
                          key={item.id}
                          value={item.name}
                          onClick={() => {
                            setValue("root", item, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                            setValue("seconde", {
                              id: "",
                              name: "",
                            });
                          }}
                        >
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>

                    <CreateCategory grade={0} />
                  </ComboboxContent>
                </Combobox>
              </Field>
              <RootCategoryWatcher
                control={control}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
                root_category={root_category as CategoryTree}
              />
            </div>
            <Field>
              <FieldLabel htmlFor="note-content" className="text-xl">
                笔记内容
              </FieldLabel>
              <div className="flex gap-2">
                <Textarea
                  id="note-content"
                  placeholder="输入笔记内容"
                  required
                  className="h-80 flex-1"
                  {...register("content")}
                />
                <div className="flex-1 border border-gray-400 rounded-xl max-h-80 overflow-auto hidden xl:block">
                  <ChatMarkDown
                    content={currentContent
                      ?.replaceAll("\\n", "\n")
                      .replaceAll("\t", "")}
                    languageType="JavaScript"
                  />
                </div>
              </div>
              <FieldDescription className="text-gray-400">
                笔记内容需要使用Markdown格式。
              </FieldDescription>
              <FieldError className="text-red-500">
                {errors.content?.message}
              </FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
      <CardFooter className="border-gray-300 dark:border-gray-600 mt-4 justify-between items-center gap-2">
        <div>
          <Button
            className="cursor-pointer text-gray-400"
            onClick={() => {
              reset();
              setEditable(false);
            }}
          >
            取消
          </Button>
          <Button className="cursor-pointer hover:bg-teal-500" type="submit">
            提交
          </Button>
        </div>
        {isSubmitting && (
          <div className="flex ">
            <Spinner className="size-6" />
            笔记正在上传中...
          </div>
        )}
      </CardFooter>
    </form>
  );
};

const RootCategoryWatcher = ({
  root_category,
  getValues,
  setValue,
  errors,
  control,
}: {
  root_category: CategoryTree | undefined;
  getValues: ReturnType<typeof useForm<FormData>>["getValues"];
  setValue: ReturnType<typeof useForm<FormData>>["setValue"];
  errors: ReturnType<typeof useForm<FormData>>["formState"]["errors"];
  control: ReturnType<typeof useForm<FormData>>["control"];
}) => {
  const root_second = useWatch({
    control,
    name: ["root", "seconde"],
  });
  console.log("root_second", root_second);
  const { data: second_category = [], isPending: rooting } = useQuery({
    queryKey: QueryKeys.fronend.rootCategories(root_second[0]?.id as string),
    // enabled: !userId,
    queryFn: async () => {
      try {
        const data = await getNoteSecondCategories(root_second[0]?.id);
        return data;
      } catch (error) {
        console.log("error", error);
        return {};
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    root_second[0]?.id && (
      <Field>
        <FieldLabel htmlFor="note-framework" className="text-xl">
          二级类型
        </FieldLabel>
        <Combobox items={(second_category as CategoryItem[]) || []}>
          <ComboboxInput
            placeholder="选择二级类型"
            required
            value={root_second[1]?.name}
            // id="note-framework"
          />
          <FieldError className="text-red-500">
            {errors.root?.message}
          </FieldError>
          <ComboboxContent className="bg-white dark:bg-gray-700">
            <ComboboxEmpty>没有该类别</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem
                  key={item?.id}
                  value={root_second[1]?.name}
                  onClick={() => {
                    setValue("seconde", item);
                  }}
                >
                  {item.name}
                </ComboboxItem>
              )}
            </ComboboxList>
            <CreateCategory grade={1} parent_id={root_second[0]?.id} />
          </ComboboxContent>
        </Combobox>
      </Field>
    )
  );
};
