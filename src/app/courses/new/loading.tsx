import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl">
        <Skeleton className="mb-4 h-8 w-28 rounded-full" />
        <div className="w-full rounded-2xl border border-zinc-200 bg-white">
          <Skeleton className="h-40 w-full rounded-b-none rounded-t-2xl" />
          <div className="px-8 py-8 sm:px-10">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="mt-2.5 h-4 w-72" />
            <div className="mt-8 flex flex-col gap-5">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-11 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
