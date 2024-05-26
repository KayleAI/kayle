"use client";

import clsx from "clsx";

type CardType = {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly [x: string]: any;
};

export default function Card({
  children,
  className = "",
  ...props
}: Readonly<CardType>): React.ReactNode {
  return (
    <div
      className={clsx(
        "border border-zinc-200 dark:border-zinc-800",
        "rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}