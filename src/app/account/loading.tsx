import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white">
        <Skeleton className="h-40 w-full rounded-b-none rounded-t-2xl" />
        <div className="px-8 py-8 sm:px-10">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2.5 h-4 w-64" />
          <div className="mt-8 flex flex-col gap-5">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
