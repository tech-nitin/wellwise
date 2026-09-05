import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors border select-none",
  {
    variants: {
      variant: {
        default:
          "border-primary/40 bg-primary/15 text-primary",
        secondary:
          "border-border bg-muted text-muted-foreground",
        outline:
          "border-border text-foreground bg-transparent",
        telemetry:
          "border-telemetry/40 bg-telemetry/15 text-telemetry",
        success:
          "border-success/40 bg-success/15 text-success",
        warning:
          "border-warning/40 bg-warning/15 text-warning",
        "risk-high":
          "border-risk-high/40 bg-risk-high/15 text-risk-high",
        "risk-critical":
          "border-risk-critical/50 bg-risk-critical/20 text-risk-critical font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
