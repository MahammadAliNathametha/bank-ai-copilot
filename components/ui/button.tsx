import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary))_65%,hsl(var(--accent)))] text-black shadow-[0_10px_30px_rgba(255,153,0,0.25)] hover:brightness-[1.05]",
        variant === "secondary" &&
          "border border-white/10 bg-white/5 text-slate-300 shadow-xl hover:bg-white/10 hover:text-white",
        variant === "ghost" && "border border-transparent bg-transparent text-slate-400 hover:bg-white/5 hover:text-white",
        className
      )}
      {...props}
    />
  );
}
