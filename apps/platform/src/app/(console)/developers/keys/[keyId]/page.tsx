"use client";

import { Button } from "@repo/ui/button";
import { Code } from "@repo/ui/text";
import { performActionOnKey } from "./actions";
import { useRouter, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { OrgArea } from "@/components/auth/OrgArea";
import { useOrg } from "@/utils/auth/OrgProvider";
import { toast } from "sonner";

export default function SpecificKey({
  params: {
    keyId = null
  }
}: {
  readonly params: {
    keyId: string | null
  }
}) {
  const router = useRouter();
  const orgs = useOrg();

  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [keyData, setKeyData] = useState(null as any);

  async function getKey() {
    const response = await fetch(`/api/keys/${keyId}?org_id=${orgs?.activeOrg?.id}`);

    const result = await response.json();

    setKeyData(result.key || null);
    setLoading(false);
  }

  useEffect(() => {
    if (keyId !== null && orgs?.activeOrg?.id !== undefined) {
      getKey()
    };
  }, [
    keyId,
    orgs
  ]);

  if (!keyId) {
    return notFound();
  }

  return (
    <OrgArea authRequired acceptRoles={["owner", "admin", "developer"]} loading={loading}>
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-row justify-end items-center gap-x-2">
          <Button
            disabled={buttonsDisabled}
            color={
              keyData?.enabled
                ? "amber"
                : "emerald"
            }
            onClick={async () => {
              toast.promise(new Promise((resolve, reject) => {
                setButtonsDisabled(true);

                setTimeout(async () => {
                  try {
                    if (!orgs?.activeOrg?.id) throw new Error("Something went wrong. Please try again.");
                    if (keyData?.enabled) await performActionOnKey({ keyId, action: "suspend", org_id: orgs?.activeOrg?.id })
                    else await performActionOnKey({ keyId, action: "activate", org_id: orgs?.activeOrg?.id });
                  } catch {
                    setButtonsDisabled(false);
                    return reject(new Error("Failed to perform action on key."));
                  }

                  await getKey();
                  setButtonsDisabled(false);
                  return resolve(true);
                }, 500);

              }), {
                loading: keyData?.enabled ? "Suspending API Key..." : "Activating API Key...",
                success: (_) => `API Key ${keyData?.enabled ? "suspended" : "activated"}.`,
                error: (error) => `Error: ${error.message}`.replace("Error: Error: ", ""),
              })
            }}
          >
            {
              keyData?.enabled
                ? "Suspend API Key"
                : "Activate API Key"
            }
          </Button>
          <Button
            disabled={buttonsDisabled}
            color="red"
            onClick={async () => {
              toast.promise(new Promise((resolve, reject) => {
                setButtonsDisabled(true);

                setTimeout(async () => {
                  try {
                    if (!orgs?.activeOrg?.id) throw new Error("Something went wrong. Please try again.");
                    await performActionOnKey({ keyId, action: "revoke", org_id: orgs?.activeOrg?.id });
                  } catch {
                    setButtonsDisabled(false);
                    return reject(new Error("Failed to delete key."));
                  }

                  await getKey();
                  setButtonsDisabled(false);
                  return resolve(true);
                }, 500);
              }), {
                loading: "Deleting API Key...",
                success: (_) => "API Key deleted.",
                error: (error) => `Error: ${error.message}`.replace("Error: Error: ", ""),
              })
              router.push("/developers/keys");
            }}
          >
            Delete API Key
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {keyData?.name ?? "Unnamed Key"}
          </h1>
          <Code>{keyId}</Code>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            Usage Graph
          </h2>
          {keyData?.usage.length === 0 ? (
            <div>
              No usage data available.
            </div>
          ) : (
            <div>
            </div>
          )}
        </div>
        <pre>
          {JSON.stringify(keyData, null, 2)}
        </pre>
      </main>
    </OrgArea>
  )
}