"use client";

import { useId, useState } from 'react'

import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { join } from "@repo/comm/newsletter"

export function ChangelogNewsletterForm() {
  let id = useId();
  const [email, setEmail] = useState('');
  const [submissionState, setSubmissionState] = useState<"idle" | "loading" | "success" | "error" | "email-error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmissionState("loading");

    if (!email?.includes('@')) {
      setSubmissionState("email-error");
      return;
    }

    const success = await join({
      email: email,
      audienceId: 'b23a5d3b-c8de-4d2e-b73b-b726b8f20ec4',
    });

    setTimeout(() => {
      if (!success) {
        setSubmissionState("error");
        return;
      }
      setSubmissionState("success"); // wait a lil’ so it feels like it’s doing something
    }, 2500);
  };

  return (
    <>
      <div>

      </div>
      <form
        className='flex flex-col gap-y-4 my-8'
        onSubmit={handleSubmit}
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <Input
          required
          type="email"
          autoComplete="email"
          name="email"
          id={id}
          invalid={submissionState === "email-error"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full"
        />
        <Button
          type="submit"
          color='white'
          className='!cursor-pointer'
          disabled={submissionState === "loading"}
        >
          Stay in the loop
        </Button>
      </form>
    </>
  )
}
