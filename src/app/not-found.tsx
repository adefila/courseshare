import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="text-center">
        <p className="font-mono text-[72px] font-bold leading-none text-zinc-900">404</p>
        <h1 className="mt-4 text-xl font-semibold text-zinc-900">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
          This page doesn&apos;t exist — it may have been moved or the course was removed.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="sm">Go home</Button>
          </Link>
          <Link href="/courses">
            <Button size="sm">Browse courses</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
