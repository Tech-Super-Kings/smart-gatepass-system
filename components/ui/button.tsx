import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-950 text-white shadow-[0_16px_36px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-slate-800 hover:text-white hover:shadow-[0_20px_40px_rgba(15,23,42,0.2)]",
  secondary:
    "bg-white/90 text-slate-950 ring-1 ring-black/8 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-white hover:text-slate-950",
  ghost:
    "bg-transparent text-slate-700 hover:bg-white/75 hover:text-slate-950",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  asChild = false,
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "className"> &
  Omit<ButtonProps, "asChild">) {
  return (
    <Button asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}