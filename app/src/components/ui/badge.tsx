import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: cn(
          neuVariants({ elevation: "flat", shape: "pill" }),
          "bg-primary text-primary-foreground",
        ),
        secondary: cn(
          neuVariants({ elevation: "flat", shape: "pill" }),
          "bg-secondary text-secondary-foreground",
        ),
        destructive: cn(
          neuVariants({ elevation: "flat", shape: "pill" }),
          "bg-destructive text-destructive-foreground",
        ),
        outline: cn(
          neuVariants({ elevation: "inset", shape: "pill" }),
          "text-foreground",
        ),
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
