"use client";

import { Heading } from "@repo/ui/heading";
import { integrations } from "@repo/config/integrations";
import { notFound } from "next/navigation";
import { Text } from "@repo/ui/text";
import { Badge } from "@repo/ui/badge";

export default function IntegrationListing({
  params: {
    integrationSlug
  }
}: {
  readonly params: {
    readonly integrationSlug: string;
  };
}): JSX.Element {
  const integration = integrations.find((integration) => integration.slug === integrationSlug);

  if (!integration) {
    return notFound();
  }

  return (
    <main>
      <Heading className="flex flex-row gap-x-2 items-center">
        {integration.name}
        {integration.comingSoon &&
          <Badge color="purple">
            Coming soon!
          </Badge>
        }
      </Heading>
      <Text>
        {integration.description}
      </Text>
    </main>
  )
}