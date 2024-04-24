import { GET } from "@/app/api/keys/[keyId]/route";

import { notFound } from "next/navigation";
import KeyDetails from "./KeyDetails";

export default async function SpecificKey({
  params: {
    keyId = null
  }
}: {
  readonly params: {
    keyId: string | null
  }
}) {
  if (!keyId) {
    return notFound();
  }
  const response = await GET(null as any, { params: { keyId } });

  const result = await response.json();
  const keyData = result.key

  return (
    <main>
      <KeyDetails keyId={keyId} keyData={keyData} />
    </main>
  )
}