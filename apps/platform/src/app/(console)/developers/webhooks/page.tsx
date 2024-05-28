"use client";

import { Card } from "@/components/card";
import { Heading, Subheading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

export default function WebhookDashboard() {
  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>
          Webhook Dashboard
        </Heading>
        <div className="flex gap-4">
        </div>
      </div>
      <main className="my-8">
        <Card className="p-4">
          <Subheading level={2}>
            Webhooks are coming soon!
          </Subheading>
          <Text>
            We are working on bringing webhooks to Kayle.
          </Text>
        </Card>
      </main>
    </>
  )
}