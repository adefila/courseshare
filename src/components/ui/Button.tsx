import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] disabled:bg-zinc-400",
  secondary:
    "bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] disabled:opacity-50",
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
        "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
