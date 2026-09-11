import { AsideNav } from "@/components/frontNote/AsideNav";
import { Suspense } from "react";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: root_category = {}, isPending: rooting } = useQuery({
  //   queryKey: ["fontendNoteRootCategories"],
  //   // enabled: !!category_id,
  //   queryFn: async () => {
  //     try {
  //       const data: CategoryTree = await getCategoryTree();
  //       return data;
  //     } catch (error) {
  //       console.log("error", error);
  //       return {};
  //     }
  //   },
  //   staleTime: Infinity,
  //   refetchOnWindowFocus: false,
  // });
  return (
    <div className="min-h-screen flex justify-between items-start p-4">
      <Suspense>
        <AsideNav />
      </Suspense>
      <div className="flex-1 px-40">{children}</div>
    </div>
  );
}
