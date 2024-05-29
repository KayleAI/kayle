"use client";

import { Heading, Subheading } from "@repo/ui/heading";

import { Link } from "@repo/ui/link";
import { Card } from "@/components/card";
import { Text } from "@repo/ui/text";
import { Badge } from "@repo/ui/badge";
import { integrations } from "@repo/config/integrations";

export default function IntegrationsDashboard() {
  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>
          Integrations Dashboard
        </Heading>
        <div className="flex gap-4">
        </div>
      </div>
      <main className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <Link href={`/developers/integrations/${integration.slug}`} key={integration.slug}>
            <Card className="p-4 relative">
              <div className="grid grid-cols-5 gap-4">
                <div className="w-full col-span-1 flex flex-col items-center justify-center">
                  <integration.icon className="fill-zinc-900 dark:fill-zinc-100 size-10" />
                </div>
                <div className="col-span-4">
                  <Subheading level={2}>
                    {integration.name}
                  </Subheading>
                  <Text>
                    {integration.description}
                  </Text>
                </div>
              </div>
              {integration.comingSoon &&
                <div className="absolute top-1 right-1">
                  <Badge color="purple">
                    Coming soon!
                  </Badge>
                </div>
              }
            </Card>
          </Link>
        ))}
      </main>
    </div>
  )
}