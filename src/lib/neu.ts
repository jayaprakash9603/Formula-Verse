import { cva, type VariantProps } from "class-variance-authority";

export const neuVariants = cva("transition-shadow transition-transform duration-200", {
  variants: {
    elevation: {
      flat: "neu-flat",
      raised: "neu-raised",
      pressed: "neu-pressed",
      inset: "neu-inset",
      none: "",
    },
    shape: {
      none: "",
      sm: "rounded-lg",
      md: "rounded-xl",
      lg: "rounded-2xl",
      pill: "rounded-full",
    },
    interactive: {
      true: "neu-interactive cursor-pointer",
      false: "",
    },
  },
  defaultVariants: {
    elevation: "raised",
    shape: "md",
    interactive: false,
  },
});

export type NeuProps = VariantProps<typeof neuVariants>;
