import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonD = () => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {Array.from({ length: 12 }, (_, index) => (
        <Card
          key={index}
          className="p-0 pb-4 w-[calc(50%-4px)] lg:w-[calc(33%-2px)] xl:w-[calc(25%-0.5rem)]"
        >
          <Skeleton className="h-40 w-full bg-gray-200 dark:bg-gray-800 rounded-none" />
          <CardContent>
            <Skeleton className="h-10 w-[calc(100%-4)] bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="flex flex-row justify-between items-center mt-4">
              <div className="flex flex-row gap-2 items-center">
                <Skeleton className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <Skeleton className="h-6 w-14 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
              <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
