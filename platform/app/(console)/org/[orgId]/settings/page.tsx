"use client";

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
    // TODO: Select an organisation
    console.warn("We need to select an organisation to view this page")
  }

  return (
    <main>

    </main>
  )
}