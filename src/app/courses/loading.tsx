import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-8 pr-8 sm:pr-10">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full rounded-full sm:w-36" />
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

      {/* Search + filter */}
      <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 w-full rounded-full sm:w-32" />
      </div>

      {/* Course card grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white" style={{ border: "0.5px solid #e8e8f0" }}>
            <Skeleton className="h-36 w-full rounded-none" />
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-5 w-44" />
              <Skeleton className="mt-2 h-4 w-56" />
              <Skeleton className="mt-4 h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
