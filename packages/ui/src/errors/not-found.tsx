import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
      <p className="text-base font-semibold leading-8 text-primary">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Page not found</h1>
      <p className="mt-6 text-base leading-7 text-foreground/80">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="mt-10">
        <Link href={process.env.NEXT_PUBLIC_APP_URL!} className="text-sm font-semibold leading-7 text-primary">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>
      </div>
    </main>
  );
}
