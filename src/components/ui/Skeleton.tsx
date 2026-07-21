export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-200/70 ${className}`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white ${className}`} style={{ border: "0.5px solid #e8e8f0" }} />
  );
}
