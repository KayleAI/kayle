import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

// Future TODO: Transparency, border-2 Radius and Box Shadow have a problem with whitespace on the corners.

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors duration-200 ease-in-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground/90 hover:bg-foreground flex shadow-inset text-background font-medium",
        default: "bg-primary/90 text-primary-foreground hover:bg-primary",
        destructive:
          "bg-destructive/80 text-destructive-foreground hover:bg-destructive",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonVariantStyles = ({ variant }: { variant: string }) => {
  const styles: any = {
    none: {},
    default: {
      boxShadow:
        "inset 1px 1px .25px 0 hsl(var(--background) / 0.12), inset -1px 1px .25px 0 hsl(var(--background) / 0.12), 0 0 0 1px hsl(var(--primary)), 0 1px 2px 0 hsl(var(--primary) / 0.64)",
    },
    primary: {
      boxShadow:
        "inset 1px 1px .25px 0 hsl(var(--background) / 0.12), inset -1px 1px .25px 0 hsl(var(--background) / 0.12), 0 0 0 1px hsl(var(--foreground)), 0 1px 2px 0 hsl(var(--foreground) / 0.64)",
    },
    secondary: {
      boxShadow:
        "inset 1px 1px .25px 0 hsl(var(--background) / 0.12), inset -1px 1px .25px 0 hsl(var(--background) / 0.12), 0 0 0 1px hsl(var(--secondary)), 0 1px 2px 0 hsl(var(--secondary) / 0)",
    },
    destructive: {
      boxShadow:
        "inset 1px 1px .25px 0 hsl(var(--background) / 0.12), inset -1px 1px .25px 0 hsl(var(--background) / 0.12), 0 0 0 1px hsl(var(--destructive)), 0 1px 2px 0 hsl(var(--destructive) / 0)",
    },
    outline: {
      boxShadow: "none",
    },
    link: {
      boxShadow: "none",
    },
    ghost: {
      boxShadow: "none",
    },
  };

  return styles[variant] || styles.none;
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{
          // @ts-expect-error - not an issue
          ...buttonVariantStyles({ variant }),
          ...style,
        }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
