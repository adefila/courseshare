import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-12">
      <div className="mx-auto max-w-xl">
        <Skeleton className="mb-6 h-8 w-32 rounded-full" />
        <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-8 sm:px-12 sm:py-10">
          <Skeleton className="mb-6 h-11 w-11 rounded-full" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2.5 h-4 w-64" />
          <div className="mt-8 flex flex-col gap-5">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
