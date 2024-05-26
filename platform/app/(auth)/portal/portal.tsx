"use client";

import { Button } from '@repo/ui/button';
import { login, signup } from './actions'

import { Field, FieldGroup, Fieldset, Label, Legend } from '@repo/ui/fieldset'
import { Input } from '@repo/ui/input'
import { Strong, Text, TextLink } from '@repo/ui/text'
import { Switch } from '@repo/ui/switch'
import { Field as HeadlessField } from '@headlessui/react'
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PortalClientPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submissionState, setSubmissionState] = useState<"idle" | "loading" | "success" | "error" | "email-error">("idle");

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <form
        className='max-w-md mx-auto w-full border border-zinc-100 dark:border-zinc-900 p-6 rounded-3xl'
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const clickedButton = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
          const action = clickedButton?.value === 'create-account' ? signup : login;

          toast.promise(new Promise((resolve, reject) => {
            setSubmissionState("loading");
            setTimeout(async () => {
              if (!email?.includes('@')) {
                setSubmissionState("email-error");
                return reject(new Error("Invalid email address."));
              }

              const { error, message } = await action(
                email,
                password,
              );

              if (error) {
                setSubmissionState("error");
                return reject(new Error(message));
              }

              setSubmissionState("success");
              return resolve(true);
            }, 500);
          }), {
            loading: clickedButton?.value === 'create-account' ? "Creating account..." : "Signing in...",
            success: clickedButton?.value === 'create-account' ? "Check your inbox to confirm your email address." : "Signed in! Redirecting...",
            error: (error) => `Error: ${error.message}`.replace("Error: Error: ", ""),
          })

          if (clickedButton?.value === 'create-account') {
            router.push("/portal/confirm");
          }
        }}
      >
        <Fieldset>
          <Legend>
            Sign in to Kayle
          </Legend>
          <Text>

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
              <Label htmlFor="password">Password</Label>
              <Input
                required
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submissionState === "loading"}
                invalid={submissionState === "error"}
              />
            </Field>
            <Field>
              <div className='flex justify-between items-center'>
                <HeadlessField className="flex items-center gap-4">
                  <Switch id="remember" name="remember" />
                  <Label htmlFor="remember">Remember me</Label>
                </HeadlessField>
                <TextLink color='white' href="/forgot" className='text-base/6 sm:text-sm/6'>
                  <Strong>
                    Forgot password?
                  </Strong>
                </TextLink>
              </div>
            </Field>
            <Field>
              <div className='flex flex-row gap-x-4'>
                <Button
                  className="w-full"
                  type="submit"
                  name="action"
                  value="create-account"
                  disabled={submissionState === "loading"}
                >
                  Create Account
                </Button>
                <Button
                  className="w-full"
                  type="submit"
                  name="action"
                  value="sign-in"
                  disabled={submissionState === "loading"}
                >
                  Sign In
                </Button>
              </div>
            </Field>
            <Text>
              By signing in or creating an account for Kayle, you agree to our <TextLink href="/terms" color='white'>Terms of Service</TextLink> and <TextLink href="/privacy" color='white'>Privacy Policy</TextLink>.
            </Text>
          </FieldGroup>
        </Fieldset>
      </form>
    </div>
  )
}