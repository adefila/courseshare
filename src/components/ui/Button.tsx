import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.97] active:bg-indigo-700 disabled:bg-indigo-300 disabled:opacity-60",
  secondary:
    "bg-white text-zinc-700 [border:0.5px_solid_#d4d4d8] hover:bg-zinc-50 hover:[border-color:#a1a1aa] active:scale-[0.97] disabled:opacity-50",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.97] disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:scale-[0.97] active:bg-red-700 disabled:opacity-50",
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
        "inline-flex cursor-pointer items-center justify-center rounded-full font-semibold tracking-normal transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
