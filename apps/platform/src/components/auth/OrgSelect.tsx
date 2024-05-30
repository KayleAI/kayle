"use client";

import { useOrg } from "@/utils/auth/OrgProvider";
import { OrgArea } from "./OrgArea";
import { Strong, Text, TextLink } from "@repo/ui/text";
import { Heading } from "@repo/ui/heading";
import { Card, CardGrid } from "@/components/card";
import { Link } from "@repo/ui/link";
import { useRouter } from "next/navigation";
import { newUrl } from "@/utils/url";

export function OrgSelect({
  url,
}: {
  readonly url: string;
}): JSX.Element {
  const orgs = useOrg();
  const router = useRouter();

  if (orgs?.activeOrg) {
    router.push(newUrl({ organisationSlug: orgs.activeOrg.slug, url: url }));
  }

  return (
    <OrgArea authRequired acceptRoles="any" loading={orgs?.orgStatus === "loading"}>
      <Card className="flex flex-col items-center">
        <Heading level={3} className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter mt-4">
          Select Organisation
        </Heading>
        <Text className="text-zinc-700 dark:text-zinc-300">
          Select an organisation to continue.
        </Text>
        <CardGrid className="w-full max-w-sm mx-auto !grid-cols-1 mt-8">
          {
            orgs?.memberOrgs?.map((org) => (
              <Link
                key={org.id}
                href={newUrl({ organisationSlug: org.slug, url: url })}
                className="w-full"
              >
                <Card canHover>
                  <Text>
                    <Strong>
                      {org.name}
                    </Strong>
                  </Text>
                </Card>
              </Link>
            ))
          }
          {
            orgs?.memberOrgs?.length === 0 && (
              <Card>
                <Text>
                  You’re not a member of any organisations.
                  <br />
                  <TextLink href="/org/create">
                    Create an organisation &rarr;
                  </TextLink>
                </Text>
              </Card>
            )
          }
        </CardGrid>
      </Card>
    </OrgArea>
  )
}
