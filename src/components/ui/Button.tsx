import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-none active:bg-indigo-700 disabled:bg-indigo-300 disabled:translate-y-0 disabled:shadow-none",
  secondary:
    "bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 hover:-translate-y-px hover:shadow-sm active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:translate-y-0",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 hover:-translate-y-px active:translate-y-0 disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-none active:bg-red-700 disabled:opacity-50 disabled:translate-y-0",
};

const sizeClasses = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-normal transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
