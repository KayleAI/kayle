"use client";

import { OrgArea } from "@/components/auth/OrgArea";
import { OrgSelect } from "@/components/auth/OrgSelect";
import { useOrg } from "@/utils/auth/OrgProvider";

export default function OrganisationSettings({
  params: {
    orgId
  }
}: {
  readonly params: {
    readonly orgId: string;
  };
}) {
  if (orgId === '_') {
    return (
      <OrgSelect url="/org/_/settings" />
    )
  }

  const orgs = useOrg();

  return (
    <OrgArea authRequired acceptRoles={["owner", "admin", "billing", "manager"]} loading={orgs?.orgStatus === "loading"}>
      <main>
      </main>
    </OrgArea>
  )
}