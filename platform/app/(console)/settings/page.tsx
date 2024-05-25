"use client";

import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";

export default function Settings() {
  return (
    <main>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>
          Settings
        </Heading>
        <div className="flex gap-4">
          <Button outline href={"/org/_/settings"}>
            Looking for organisation settings?
          </Button>
          <Button
            href={"/sign-out"}
          >
            Sign out
          </Button>
        </div>
      </div>

    </main>
  )
}