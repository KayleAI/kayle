"use client";

import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";

import { Description, Field, FieldGroup, Fieldset, Label, Legend } from '@repo/ui/fieldset'
import { Text } from '@repo/ui/text'
import { useRef, useState } from "react"
import { Listbox, ListboxOption, ListboxLabel } from '@repo/ui/listbox'
import { toast } from "sonner";
import { createClient } from "@repo/db/client";
import { Input } from "@repo/ui/input";
import { AuthArea } from "@/components/auth/AuthArea";

type OrganisationType = "social_media" | "forum" | "gaming" | "education" | "other";

export default function CreateNewOrganisation() {
  const supabase = createClient();

  const formRef = useRef<HTMLFormElement>(null);
  const [orgName, setOrgName] = useState<string>("");
  const [orgSlug, setOrgSlug] = useState<string>("");
  const [orgType, setOrgType] = useState<OrganisationType>("education");
  const [submissionState, setSubmissionState] = useState<"idle" | "loading" | "success" | "error">("idle");

  return (
    <AuthArea authRequired>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>
          Create new organisation
        </Heading>
        <div className="flex gap-4">
          <Button
            href="/contact"
          >
            Contact sales
          </Button>
        </div>
      </div>
      <form
        className="my-8"
        ref={formRef}
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          toast.promise(new Promise((resolve, reject) => {
            setSubmissionState("loading");
            setTimeout(async () => {
              const { error } = await supabase
                .rpc(
                  "create_organisation",
                  {
                    org_name: orgName,
                    org_avatar: null,
                    org_slug: orgSlug,
                    org_type: orgType,
                  }
                );

              if (error) {
                setSubmissionState("error");
                return reject(new Error(error.message));
              }

              setSubmissionState("success");
              window.location.href = `/org/${orgSlug}`;
              return resolve(true);
            }, 500);
          }), {
            loading: "Creating organisation...",
            success: "Organisation created!",
            error: (error) => `Error: ${error.message}`.replace("Error: Error: ", ""),
          })
        }}
      >
        <Fieldset>
          <Legend>
            New Organisation
          </Legend>
          <Text>
            Create a new organisation to start moderating your platforms.
          </Text>
          <FieldGroup>
            <Field>
              <Label>
                Organisation Name
              </Label>
              <Input
                required
                name="org_name"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={submissionState === "loading"}
              />
              <Description>
                The name of your organisation.
              </Description>
            </Field>
            <Field>
              <Label>
                Organisation Identifier
              </Label>
              <Input
                required
                name="org_slug"
                type="text"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                disabled={submissionState === "loading"}
              />
              <Description>
                The unique identifier for your organisation.
              </Description>
            </Field>
            <Field>
              <Label>
                Organisation Type
              </Label>
              <Listbox
                name="type"
                defaultValue="education"
                value={orgType}
                onChange={(value: string) => setOrgType(value as OrganisationType)}
                disabled={submissionState === "loading"}
              >
                <ListboxOption value="education">
                  <ListboxLabel>Education</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="social_media">
                  <ListboxLabel>Social Media</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="forum">
                  <ListboxLabel>Forum</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="gaming">
                  <ListboxLabel>Gaming</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="other">
                  <ListboxLabel>Something else</ListboxLabel>
                </ListboxOption>
              </Listbox>
              <Description>
                What does your organisation primarily run?
              </Description>
            </Field>
            <Field>
              <Button
                type="submit"
                disabled={submissionState === "loading"}
              >
                Create organisation
              </Button>
            </Field>
          </FieldGroup>
        </Fieldset>
      </form>
    </AuthArea>
  )
}