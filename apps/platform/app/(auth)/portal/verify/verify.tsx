"use client";

import { Button } from '@repo/ui/button';

import { Field, FieldGroup, Fieldset, Legend } from '@repo/ui/fieldset'
import { Text, TextLink } from '@repo/ui/text'
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { OTPInput, SlotProps } from 'input-otp'
import { useQueryState } from 'nuqs';
import { verifyOtp } from '../actions';
import { redirect } from 'next/navigation';

export default function VerifyLogin() {
  const [otp, setOtp] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const [email] = useQueryState('email', {
    defaultValue: ''
  });
  const [submissionState, setSubmissionState] = useState<"idle" | "loading" | "success" | "error" | "email-error">("idle");

  if (!email) {
    return redirect("/portal");
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <form
        className='max-w-md mx-auto w-full border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl'
        ref={formRef}
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          toast.promise(new Promise((resolve, reject) => {
            setSubmissionState("loading");
            setTimeout(async () => {
              if (!otp || otp.length !== 6) {
                setSubmissionState("error");
                return reject(new Error("Invalid OTP."));
              }

              if (!email?.includes('@')) {
                setSubmissionState("email-error");
                return reject(new Error("Invalid email address."));
              }

              const { error, message } = await verifyOtp(email, otp);

              if (error) {
                setSubmissionState("error");
                return reject(new Error(message));
              }

              setSubmissionState("success");
              window.location.href = "/"; // force page reload to update auth status
              return resolve(true);
            }, 500);
          }), {
            loading: "Signing in...",
            success: "Awesome! You’re now signed in. Redirecting...",
            error: (error) => `Error: ${error.message}`.replace("Error: Error: ", ""),
          })
        }}
      >
        <Fieldset>
          <Legend>
            Sign in to Kayle
          </Legend>
          <Text>
            Enter the 6-digit code sent to your email address.
          </Text>
          <FieldGroup>
            <Field>
              <div className='my-4 w-full flex justify-center items-center'>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  onComplete={() => formRef.current?.requestSubmit()}
                  containerClassName="group flex items-center has-[:disabled]:opacity-30"
                  render={({ slots }) => (
                    <>
                      <div className="flex">
                        {slots.slice(0, 3).map((slot, idx) => (
                          <Slot key={idx} {...slot} /> // NOSONAR
                        ))}
                      </div>

                      <FakeDash />

                      <div className="flex">
                        {slots.slice(3).map((slot, idx) => (
                          <Slot key={idx} {...slot} /> // NOSONAR
                        ))}
                      </div>
                    </>
                  )}
                />
              </div>
            </Field>
            <Field>
              <Button
                className="w-full"
                type="submit"
                disabled={submissionState === "loading"}
              >
                Verify Code
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

function Slot(props: Readonly<SlotProps>) {
  return (
    <div
      className={clsx(
        'relative w-10 h-14 text-[2rem]',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border-zinc-400 dark:border-zinc-600 border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
        'group-hover:border-zinc-500 group-focus-within:border-500',
        'outline outline-0 outline-zinc-200/50 dark:outline-zinc-700/50',
        'text-zinc-950 dark:text-zinc-50',
        { 'outline-4 outline-zinc-200/50 dark:outline-zinc-800/50': props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

// You can emulate a fake textbox caret!
function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-zinc-800 dark:bg-zinc-200/50" />
    </div>
  )
}

// Inspired by Stripe's MFA input.
function FakeDash() {
  return (
    <div className="flex w-10 justify-center items-center">
      <div className="w-3 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
    </div>
  )
}