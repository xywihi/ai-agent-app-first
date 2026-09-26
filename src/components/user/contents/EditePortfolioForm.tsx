import { Button } from "../../ui/button";
import { CardFooter } from "../../ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../../ui/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../../ui/field";
import { Textarea } from "../../ui/textarea";
import { CreateCategory } from "./CreateCategory";
import { Input } from "../../ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "../../ui/spinner";
import {
  PortfolioCategory,
  ProcessedPortfolioWork,
} from "@/app/utils/api/design/type";
import { CreateTags } from "@/components/CreateTags";
import { getPortfolioCategories } from "@/app/utils/api/design/reuqery";
import { UpdateImages } from "@/components/design/UpdateImages";
import { toast } from "sonner";
import client from "@/lib/server";
import { useCallback } from "react";
import { QueryKeys } from "@/app/utils/query-keys";
import { Post } from "@/app/utils/query";
import { Switch } from "@/components/ui/switch";
// 提交编辑作品表单
const TOAST_STYLE_SUCCESS = {
  backgroundColor: "#00d5be",
  borderRadius: "8px",
};
const TOAST_STYLE_ERROR = {
  backgroundColor: "#FF6470",
  borderRadius: "8px",
};
const formSchema = z.object({
  title: z.string().min(2, {
    message: "标题至少2个字",
  }),
  description: z.string(),
  is_public: z.boolean(),
  category_id: z.object({
    id: z.string(),
    name: z
      .string()
      .min(1, {
        message: "此分类为必选",
      })
      .optional(),
  }),
  tags: z.array(z.string()).optional(),
  images: z.array(z.file()).optional(),
});
type FormData = z.infer<typeof formSchema>;

export const EditePortfolioForm = ({
  portfolio_data,
  setEditable,
}: {
  portfolio_data?: ProcessedPortfolioWork;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const {
    register,

    handleSubmit,
    getValues,
    setValue,
    reset,
    getErrors,
    // watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: portfolio_data?.title,
      description: portfolio_data?.description || "",
      is_public: portfolio_data?.is_published || false,
      category_id: {
        id: portfolio_data?.portfolio_categories.id,
        name: portfolio_data?.portfolio_categories.title,
      },
      tags: portfolio_data?.tags,
      images: [],
    },
  });
  const { data: portfolio_categories, error } = useQuery({
    queryKey: QueryKeys.portfolio.categories,
    queryFn: async () => {
      const _data = await getPortfolioCategories();
      const data = await _data.json();
      return data.data;
    },
  });
  // useEffect(() => {
  //   const default_root = root_category?.category_id.filter((item) => {
  //     if (item.id === portfolio_data?.category_id) {
  //       return item;
  //     }
  //   });
  //   const default_seconde = root_category?.seconde.filter((item) => {
  //     if (item.id === portfolio_data?.sub_category_id) {
  //       return item;
  //     }
  //   });
  //   setValue("category_id", default_root[0]);
  //   setValue("seconde", default_seconde[0]);
  // }, [note_data, root_category, setValue]);
  const getFilePath = useCallback((userId: string, fileName: string) => {
    return `${userId}/${Date.now()}-${fileName}`;
  }, []);

  // workId：组件外层变量，不要再作为函数入参！！！
  const onSubmit = async (data: FormData, workId?: string) => {
    try {
      // ========== 1.保存作品基础信息 ==========
      const _portfolio_data: {
        work: {
          id?: string;
          category_id: string;
          title: string;
          description: string;
          tags: string[] | undefined;
          is_published: boolean;
        };
      } = {
        work: {
          category_id: data.category_id.id,
          title: data.title,
          description: data.description,
          tags: data.tags,
          is_published: data.is_public,
        },
      };
      if (workId) _portfolio_data.work.id = workId;
      const result_new_portfolio = await Post(
        `/api/user/design/portfolio${workId ? "/update" : ""}`,
        { body: JSON.stringify(_portfolio_data) }
      );
      // 没有图片直接结束，不用执行上传逻辑
      if (!data.images || data.images.length === 0) {
        await queryClient.invalidateQueries({
          queryKey: QueryKeys.portfolio.portfoliosAll,
        });
        toast.success("创建成功", {
          position: "top-center",
          style: TOAST_STYLE_SUCCESS,
        });
        reset();
        window.scrollTo(0, 0);
        setEditable(false);
        return;
      }
      // ========== 2.批量并发上传图片 ==========
      const { data: claimsData, error: claimsError } =
        await client.auth.getClaims();
      if (claimsError || !claimsData?.claims?.sub)
        throw new Error("用户未登录");
      const userId = claimsData?.claims.sub;

      // 并发上传所有图片
      const uploadPromises = data.images.map(async (file) => {
        const filePath = getFilePath(userId, file.name);
        const { error: uploadErr } = await client.storage
          .from("portfolio-images")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadErr) throw uploadErr;

        const { data: urlData } = client.storage
          .from("portfolio-images")
          .getPublicUrl(filePath);

        return urlData.publicUrl;
      });

      // 等待全部上传完成，任意一张失败直接抛异常进入catch
      const imageUrls = await Promise.all(uploadPromises);

      // ==========3.保存图片url入库 ==========
      const _images_data = {
        portfolio_id: workId || result_new_portfolio.id,
        image_urls: imageUrls,
      };

      const result_new_images = await Post(`/api/user/design/images`, {
        body: JSON.stringify(_images_data),
      });

      if (result_new_images && result_new_images.error) {
        throw new Error("图片入库失败");
      }

      // ==========4.成功后操作 ==========
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.portfolio.portfoliosAll,
      });
      toast.success("创建成功", {
        position: "top-center",
        style: TOAST_STYLE_SUCCESS,
      });
      reset();
      window.scrollTo(0, 0);
      setEditable(false);
    } catch (error) {
      console.error("submit error：", error);
      toast.error("出问题了，请重试！", {
        position: "top-center",
        style: TOAST_STYLE_ERROR,
      });
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data, portfolio_data?.id);
      })}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="border-gray-300 dark:border-gray-600 text-2xl font-bold">
            {portfolio_data ? "编辑" : "创建新的"}作品
          </FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="portfolio-title" className="text-xl">
                标题
              </FieldLabel>
              <Input
                id="portfolio-title"
                placeholder="请输入标题"
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
                <FieldLabel htmlFor="portfolio-framework" className="text-xl">
                  作品类型
                </FieldLabel>
                <Combobox
                  items={
                    portfolio_categories &&
                    (portfolio_categories as PortfolioCategory[])
                  }
                >
                  {!portfolio_data ? (
                    <ComboboxInput
                      placeholder="选择作品类型"

                      // id="note-framework"
                    />
                  ) : (
                    <ComboboxInput
                      placeholder="选择一级类型"
                      required
                      value={portfolio_data.portfolio_categories.title}
                      // id="note-framework"
                    />
                  )}

                  <FieldError className="text-red-500">
                    {errors.category_id?.message}
                  </FieldError>
                  <ComboboxContent className="bg-white dark:bg-gray-700">
                    <ComboboxEmpty>新增作品类型</ComboboxEmpty>
                    <ComboboxList>
                      {/* <ComboboxItem>一级类型</ComboboxItem> */}
                      {(item) => (
                        <ComboboxItem
                          key={item.id}
                          value={item.title}
                          onClick={() => {
                            setValue(
                              "category_id",
                              { id: item.id, name: item.title },
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              }
                            );
                          }}
                        >
                          {item.title}
                        </ComboboxItem>
                      )}
                    </ComboboxList>

                    <CreateCategory grade={0} />
                  </ComboboxContent>
                </Combobox>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="portfolio-description" className="text-xl">
                作品描述
              </FieldLabel>
              <Textarea
                id="portfolio-description"
                placeholder="输入笔记内容"
                className="h-80 flex-1"
                {...register("description")}
              />
              <FieldError className="text-red-500">
                {errors.description?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="portfolio-switch" className="text-xl">
                是否公开
              </FieldLabel>
              <Switch
                id="portfolio-switch"
                className="data-unchecked:bg-gray-300 data-checked:bg-teal-300"
                defaultChecked={portfolio_data?.is_published ?? false}
                {...register("is_public")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="portfolio-tags" className="text-xl">
                添加标签
              </FieldLabel>
              <CreateTags
                defaultTags={portfolio_data?.tags ?? []}
                getValues={getValues}
                setValue={setValue}
                reset={reset}
              />
              <FieldError className="text-red-500">
                {errors.description?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel className="text-xl">作品图片</FieldLabel>
              <UpdateImages
                setValue={setValue}
                defaultImages={portfolio_data?.portfolio_work_images ?? []}
              />
              <FieldError className="text-red-500">
                {errors.description?.message}
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
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            className="cursor-pointer hover:bg-teal-500"
            type="submit"
            disabled={isSubmitting}
          >
            提交
          </Button>
        </div>
        {isSubmitting && (
          <div className="flex ">
            <Spinner className="size-6" />
            作品正在上传中...
          </div>
        )}
      </CardFooter>
    </form>
  );
};
