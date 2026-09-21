import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/app/utils/query-keys";
import { Get } from "@/app/utils/query";

export function useUserQuery() {
  return useQuery({
    queryKey: QueryKeys.userCenter.data,
    queryFn: async () => {
      const data = await Get("/api/user");
      return data.user;
    },
    staleTime: 5 * 60 * 1000,
  });
}
