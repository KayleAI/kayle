"use client";

import clsx from "clsx";

type CardType = {
  readonly children: React.ReactNode;
  readonly canHover?: boolean;
  readonly className?: string;
  readonly [x: string]: any;
};

export function Card({
  children,
  canHover = false,
  className = "",
  ...props
}: Readonly<CardType>): React.ReactNode {
  return (
    <div
      className={clsx(
        "border border-zinc-950/10 dark:border-white/10",
        canHover && "hover:border-zinc-950/20 dark:hover:border-white/20 transition ease-out duration-75",
        "rounded-lg",
        "p-4", // default padding
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardGrid({
  children,
  className = ""
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 md:grid-cols-2 gap-4",
        className
      )}
    >
      {children}
    </div>
  )
}