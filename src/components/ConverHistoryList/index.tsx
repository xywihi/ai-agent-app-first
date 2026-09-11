"use client";
import {
  ConverHistoryListInterface,
  deleteConverHistoryList,
} from "@/app/utils/api/chat";
import { useParams, useRouter } from "next/navigation";
import { createConver } from "@/app/utils/api/chat";
import { cn } from "@/app/utils/tools";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { createClient } from "@/lib/server/client";
import z from "zod";
interface PropsInterface {
  data: ConverHistoryListInterface[];
  isLoading?: boolean;
}
const Schema = z.object({
  user: z.object({
    id: z.string(),
    user_metadata: z.object({
      email: z.string(),
      username: z.string(),
    }),
  }),
});
export const ConverHistoryList = ({ data, isLoading }: PropsInterface) => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const { mutate: mutateCreate, isPending: isLoadingCreate } = useMutation({
    mutationFn: async () => {
      const data_user = await createClient().auth.getUser();
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
        queryKey: ["converHistories"],
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
        queryKey: ["converHistories"],
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
    <div className="p-4 py-6 mb-4 border rounded-2xl h-full flex-1 max-w-2xl">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">会话历史</h1>
        <button
          className="border rounded-2xl px-2 py-1 text-xs cursor-pointer hover:text-white hover:bg-teal-400"
          onClick={() => mutateCreate()}
        >
          {isLoadingCreate ? <Spinner /> : "新建对话+"}
        </button>
      </div>
      {/* <hr className="my-4 opacity-50" /> */}
      {data?.length === 0 && (
        <div className="flex flex-row justify-center items-center h-[calc(100%-5rem)] text-gray-500">
          <span>会话历史为空</span>
        </div>
      )}
      <ul>
        {isLoading && <li>加载中...</li>}
        {data?.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex flex-row justify-between items-center mb-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-800",
              item.id.toString() === params.id && "bg-gray-200 dark:bg-gray-800"
            )}
            onClick={() => {
              router.push(`/chat/${item.id}`);
            }}
          >
            <span className="truncate">{item.conversation_name}</span>
            <button
              disabled={isLoadingDelete && item.id.toString() === variables}
              onClick={(e) => {
                e.stopPropagation();
                mutationDelete.bind(null, item.id.toString())();
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
  );
};
