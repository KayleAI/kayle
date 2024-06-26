"use client";

import { Card, CardGrid } from "@/components/card";
import { Badge } from "@repo/ui/badge";
import { Heading, Subheading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";

const options = [
  {
    slug: "keys",
    name: "API Keys",
    description: "Manage your API keys.",
  },
  {
    slug: "integrations",
    name: "Integrations",
    description: "Connect Kayle to external services.",
  },
  {
    slug: "webhooks",
    name: "Webhooks",
    description: "Connect Kayle to your own services.",
    comingSoon: true,
  }
]

export default function DeveloperDashboard() {
  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>
          Developer Dashboard
        </Heading>
        <div className="flex gap-4">
        </div>
      </div>
      <CardGrid className="my-8">
        {options.map((option) => (
          <Link href={`/developers/${option.slug}`} key={option.slug}>
            <Card className="p-4 relative">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-4">
                  <Subheading level={2}>
                    {option.name}
                  </Subheading>
                  <Text>
                    {option.description}
                  </Text>
                </div>
              </div>
              {option.comingSoon && (
                <Badge className="absolute top-1 right-1" color="purple">
                  Coming Soon
                </Badge>
              )}
            </Card>
          </Link>
        ))}
      </CardGrid>
    </>
  )
}