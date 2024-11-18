import { Skeleton } from "@/components/ui/skeleton";

export const UserWorkflowsSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton className="h-32 w-full" key={i} />
      ))}
    </div>
  );
};
