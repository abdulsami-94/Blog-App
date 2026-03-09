import { Skeleton } from "@/components/ui/Skeleton";

export default function PostLoading(): JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="mt-4 h-5 w-1/2" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
