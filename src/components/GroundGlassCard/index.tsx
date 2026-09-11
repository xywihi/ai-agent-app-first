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
        "h-full w-1/4 bg-white/40 border border-white/40 rounded-xl p-4 drop-shadow-[0_4px_12px_#ccc] backdrop-blur-md transition-all duration-300 ease-out hover:drop-shadow-[0_8px_12px_#bcbcbc] hover:-translate-y-1 hover:border-white/60",
        className
      )}
    >
      <Card
        className={cn("h-full bg-white/20 backdrop-blur-md", cardClassName)}
      >
        {children}
      </Card>
    </div>
  );
};
