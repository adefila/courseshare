import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "rounded-xl [border:0.5px_solid_#e4e4e7] bg-white px-3.5 py-2.5 text-base text-zinc-900 transition placeholder:text-zinc-400 focus:border-indigo-400 focus:[border-width:1px] focus:outline-none focus:ring-2 focus:ring-indigo-100/80 disabled:bg-zinc-50/60 disabled:text-zinc-400 sm:text-sm",
          error && "border-red-400 focus:border-red-400 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
