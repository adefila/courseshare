import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Skeleton className="mb-6 h-8 w-28 rounded-full" />

        {/* Course header card */}
        <div className="mb-8 rounded-2xl bg-white p-6 sm:p-8" style={{ border: "0.5px solid #e4e4f0" }}>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-8 w-64" />
          <Skeleton className="mt-2.5 h-4 w-48" />
          <Skeleton className="mt-5 h-7 w-32" />
        </div>

        {/* Resources heading */}
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>

        {/* Resource rows */}
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-5" style={{ border: "0.5px solid #e8e8f0" }}>
              <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="mt-2 h-3 w-64" />
              </div>
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
