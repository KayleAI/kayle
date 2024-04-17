"use client";

import { Button } from '@repo/ui/button';
import Link from 'next/link';
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
      <p className="text-base font-semibold leading-8 text-primary">
        Error
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
        Well... this is awkward.
      </h1>
      <p className="mt-6 text-base leading-7 text-foreground/80">
        We’ve run into a problem; we don’t know what it is yet, but we’re working on it!
      </p>
      <pre className='font-mono text-xs mt-4'>
        Technical details:
        <br />
        {error.message}
      </pre>
      <div className="mt-10 flex flex-row gap-x-6 items-center">
        <Button
          onClick={reset}
          className=""
        >
          Try again
        </Button>
        <Link href={process.env.NEXT_PUBLIC_APP_URL!} className="text-sm font-semibold leading-7 text-primary">
          Go back home
        </Link>
      </div>
    </main>
  )
}