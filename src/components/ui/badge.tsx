import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow-sm shadow-cyan-500/20 [a&]:hover:from-cyan-500/30 [a&]:hover:to-purple-500/30",
        secondary:
          "border-purple-500/50 bg-purple-500/20 text-purple-400 shadow-sm shadow-purple-500/20 [a&]:hover:bg-purple-500/30",
        destructive:
          "border-red-500/50 bg-red-500/20 text-red-400 shadow-sm shadow-red-500/20 [a&]:hover:bg-red-500/30 focus-visible:ring-red-500/20",
        outline:
          "text-foreground border-cyan-500/30 [a&]:hover:bg-cyan-500/10 [a&]:hover:text-cyan-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };