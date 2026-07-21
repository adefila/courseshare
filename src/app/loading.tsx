import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8 sm:pr-10">
      {/* Welcome header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="h-8 w-64 sm:h-9" />
          <Skeleton className="mt-2.5 h-4 w-full max-w-sm" />
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <Skeleton className="h-5 w-20 sm:h-7 sm:w-28" />
          <Skeleton className="mt-1.5 h-3 w-16" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-white px-5 py-4" style={{ border: "0.5px solid #e8e8f0" }}>
            <Skeleton className="h-[52px] w-16" />
            <Skeleton className="mt-2.5 h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Recently added */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl bg-white px-5 py-3.5" style={{ border: "0.5px solid #e8e8f0" }}>
            <Skeleton className="h-9 w-10 shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-1.5 h-3 w-28" />
            </div>
            <Skeleton className="hidden h-5 w-16 sm:block" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
