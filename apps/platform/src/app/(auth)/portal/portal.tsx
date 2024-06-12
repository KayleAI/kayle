"use client";

import { magicOtp } from './actions'

import { Button } from '@repo/ui/button';
import { Field, FieldGroup, Fieldset, Label, Legend } from '@repo/ui/fieldset'
import { Input } from '@repo/ui/input'
import { Text, TextLink } from '@repo/ui/text'
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PortalClientPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submissionState, setSubmissionState] = useState<"idle" | "loading" | "success" | "error" | "email-error">("idle");

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <form
        className='max-w-md mx-auto w-full border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl'
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          toast.promise(new Promise((resolve, reject) => {
            setSubmissionState("loading");
            setTimeout(async () => {
              if (!email?.includes('@')) {
                setSubmissionState("email-error");
                return reject(new Error("Invalid email address."));
              }

              const { error, message } = await magicOtp(email);

              if (error) {
                setSubmissionState("error");
                return reject(new Error(message));
              }

              router.push(`/portal/verify?email=${email}`);
              setSubmissionState("success");
              return resolve(true);
            }, 500);
          }), {
            loading: "Signing in...",
            success: "Check your inbox to continue.",
            error: (error) => `Error: ${error.message}`.replace("Error: Error: ", ""),
          })
        }}
      >
        <Fieldset>
          <Legend>
            Sign in to Kayle
          </Legend>
          <Text>
            Enter your email address to continue to Kayle.
          </Text>
          <FieldGroup>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                required
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submissionState === "loading"}
                invalid={submissionState === "email-error"}
              />
            </Field>
            <Field>
                <Button
                  className="w-full"
                  type="submit"
                  name="action"
                  value="sign-in"
                  disabled={submissionState === "loading"}
                >
                  Continue
                </Button>
            </Field>
            <Text>
              By continuing, you agree to our <TextLink href="/terms" color='white'>Terms of Service</TextLink> and <TextLink href="/privacy" color='white'>Privacy Policy</TextLink>.
            </Text>
          </FieldGroup>
        </Fieldset>
      </form>
    </div>
  )
}