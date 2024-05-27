"use client";

import clsx from "clsx";

type CardType = {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly [x: string]: any;
};

export function Card({
  children,
  className = "",
  ...props
}: Readonly<CardType>): React.ReactNode {
  return (
    <div
      className={clsx(
        "border border-zinc-950/10 dark:border-white/10",
        "rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}