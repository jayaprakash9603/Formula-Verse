"use client";
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer touch-none select-none items-center group",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        neuVariants({ elevation: "inset", shape: "pill" }),
        "relative h-2 w-full grow overflow-hidden bg-background",
      )}
    >
      <SliderPrimitive.Range className="absolute h-full bg-primary transition-colors" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        neuVariants({ elevation: "raised", shape: "pill", interactive: true }),
        "block h-5 w-5 cursor-grab bg-background",
        "active:cursor-grabbing",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
