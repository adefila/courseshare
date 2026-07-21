"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-zinc-900">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
          An unexpected error occurred. Try again, or head back home.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="sm">Go home</Button>
          </Link>
          <Button size="sm" onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
