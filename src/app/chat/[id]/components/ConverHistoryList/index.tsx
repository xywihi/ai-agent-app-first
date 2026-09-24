"use client";
import {
  ConverListSchema,
  deleteConverHistoryList,
  getConverHistoryList,
} from "@/app/utils/api/chat";
import { useParams, useRouter } from "next/navigation";
import { createConver } from "@/app/utils/api/chat";
import { cn } from "@/app/utils/tools";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import client from "@/lib/server";
import z from "zod";
import { QueryKeys } from "@/app/utils/query-keys";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Schema = z.object({
  user: z.object({
    id: z.string(),
    user_metadata: z.object({
      email: z.string(),
      username: z.string(),
    }),
  }),
});
export const ConverHistoryList = () => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { data = [], isPending } = useQuery({
    queryKey: QueryKeys.aiChat.history,
    queryFn: async () => {
      try {
        const data = await client.auth.getUser();
        const user = Schema.safeParse(data.data);
        if (user.success) {
          const result_converList = await getConverHistoryList(
            user?.data?.user.id as string
          );
          const result = ConverListSchema.safeParse(result_converList);
          if (result.success) {
            const filterList = result.data.filter(
              (item) => item.user_id.toString() === user.data.user.id
            );
            return filterList;
          } else {
            throw new Error(result.error.message);
          }
        } else {
          throw new Error(user.error.message);
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { mutate: mutateCreate, isPending: isLoadingCreate } = useMutation({
    mutationFn: async () => {
      const data_user = await client.auth.getUser();
      const user = Schema.safeParse(data_user.data);
      if (user.success) {
        const data_create = await createConver(user?.data?.user.id);
        return data_create;
      } else {
        throw new Error(user.error.message);
      }
    },
    onSuccess: (data_id) => {
      router.push(`/chat/${data_id}`);
      queryClient.invalidateQueries({
        queryKey: QueryKeys.aiChat.history,
      });
    },
  });
  const {
    mutate: mutationDelete,
    isPending: isLoadingDelete,
    variables,
  } = useMutation({
    mutationFn: (id: string) => deleteConverHistoryList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.aiChat.history,
      });
      if (data[0]) {
        router.push(`/chat/${data[0].id}`);
      } else {
        router.refresh();
      }
      console.log("variables", variables);
    },
  });
  return (
    <div className="p-4 py-6 rounded-2xl h-[calc(100vh-8rem)] xl:h-[calc(100vh-10rem)] flex-1 max-w-140 w-full lg:w-120 xl:w-180 z-10 bg-white dark:bg-gray-700 px-4 shadow-2xl">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">会话历史</h1>
        <Button
          className="rounded-2xl px-4 py-1 text-xs cursor-pointer bg-gray-100 dark:bg-gray-800 hover:text-white hover:bg-teal-400 dark:hover:bg-teal-600"
          onClick={() => mutateCreate()}
        >
          {isLoadingCreate ? <Spinner /> : "新建对话+"}
        </Button>
      </div>
      <div className="h-[calc(100%-3rem)] overflow-auto">
        {/* <hr className="my-4 opacity-50" /> */}
        {data?.length === 0 && !isPending && (
          <div className="flex flex-row justify-center items-center h-[calc(100%-5rem)] text-gray-500">
            <span>会话历史为空</span>
          </div>
        )}
        <ul className="h-full flex flex-col gap-2">
          {isPending && (
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-12 w-[calc(100%-4)] bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <Skeleton className="h-12 w-[calc(100%-4)] bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
          )}
          {data?.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex flex-row justify-between items-center px-3 py-2 rounded-xl cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-900",
                item.id.toString() === params.id &&
                  "bg-gray-200 dark:bg-gray-900"
              )}
              onClick={() => {
                router.push(`/chat/${item.id}`);
              }}
            >
              <span className="truncate">{item.conversation_name}</span>
              <button
                disabled={isLoadingDelete && item.id.toString() === variables}
                onClick={(e) => {
                  // 删除前确认
                  e.stopPropagation();
                  toast("删除会话", {
                    description: "确定要删除会话吗?",
                    action: {
                      label: "确认删除",
                      onClick: () => {
                        mutationDelete(item.id.toString());
                      },
                    },
                    cancel: {
                      label: "取消",
                      onClick: () => {},
                    },
                  });
                }}
                className="disabled:text-gray-200 hover:text-red-500 text-gray-500 py-1 px-2 rounded text-xs text-nowrap cursor-pointer"
              >
                {!isLoadingDelete && item.id.toString() === variables ? (
                  <Spinner className="size-6" />
                ) : (
                  <CircleX />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
