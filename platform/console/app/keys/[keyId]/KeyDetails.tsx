"use client";

import { Button } from "@repo/ui/button";
import { Code } from "@repo/ui/text";
import { performActionOnKey } from "./actions";
import { useRouter } from "next/navigation";

export default function KeyDetails({
  keyId,
  keyData
}: {
  readonly keyId: string;
  readonly keyData: any;
}) {
  const router = useRouter();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex flex-row justify-end items-center gap-x-2">
        <Button
          color={
            keyData?.enabled
              ? "amber"
              : "lime"
          }
          onClick={async () => {
            if (keyData?.enabled) await performActionOnKey({ keyId, action: "suspend" })
            else await performActionOnKey({ keyId, action: "activate" });
            router.refresh();
          }}
        >
          {
            keyData?.enabled
              ? "Suspend API Key"
              : "Activate API Key"
          }
        </Button>
        <Button
          color="red"
          onClick={async () => {
            await performActionOnKey({ keyId, action: "revoke" });
            router.push("/keys");
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
  )
}