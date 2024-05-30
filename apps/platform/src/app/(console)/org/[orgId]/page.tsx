"use client";

import { OrgArea } from "@/components/auth/OrgArea";
import { OrgSelect } from "@/components/auth/OrgSelect";
import { useOrg } from "@/utils/auth/OrgProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { newUrl } from "@/utils/url";

export default function Organisation({
  params: {
    orgId = "_"
  }
}: {
  readonly params: {
    readonly orgId: string;
  };
}) {
  const orgs = useOrg();
  const router = useRouter();

  useEffect(() => {
    if (orgId !== orgs?.activeOrg?.slug) {
      /**router.push(newUrl({ organisationSlug: orgs?.activeOrg?.slug ?? "", url: "/org/_" }));*/
      router.refresh();
    }
  }, [
    orgs?.activeOrg
  ]);

  if (orgId === "_") {
    return (
      <OrgSelect url="/org/_" />
    )
  };

  return (
    <OrgArea authRequired acceptRoles="any">
      <main>

      </main>
    </OrgArea>
  );
}