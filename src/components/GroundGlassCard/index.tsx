import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

export const GroundGlassCard = ({
  children,
  className,
  cardClassName,
}: {
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "h-full w-1/4 bg-white/40 dark:bg-gray-700/40 border border-white/40 dark:border-black/40 rounded-xl p-4 drop-shadow-[0_4px_12px_#ccc] dark:drop-shadow-[0_4px_12px_#4b4b4b] backdrop-blur-md transition-all duration-300 ease-out hover:drop-shadow-[0_8px_12px_#bcbcbc] dark:hover:drop-shadow-[0_8px_12px_#494949] hover:-translate-y-1 hover:border-white/60 dark:hover:border-black/60",
        className
      )}
    >
      <Card
        className={cn(
          "h-full bg-white/20 dark:bg-gray-700/20 backdrop-blur-md",
          cardClassName
        )}
      >
        {children}
      </Card>
    </div>
  );
};
