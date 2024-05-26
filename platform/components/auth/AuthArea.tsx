"use client";

import { useAuth } from "@/utils/auth/AuthProvider";
import { Button } from "@repo/ui/button";
import Card from "../Card";

export function AuthArea({
  authRequired = false,
  children
}: {
  readonly authRequired?: boolean;
  readonly children: React.ReactNode;
}): React.ReactNode {
  const user = useAuth();

  if (user?.authStatus === "loading") {
    return (
      <AuthAreaContainer>
        <h3
          className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter"
        >
          Loading...
        </h3>
        <p className="text-zinc-700 dark:text-zinc-300">
          Please wait while we check your authentication status.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-x-4">
          <Button plain disabled>
            Verifying...
          </Button>
        </div>
      </AuthAreaContainer>
    );
  }

  if (authRequired && user?.authStatus === "unauthenticated") {
    return (
      <AuthAreaContainer>
        <h3
          className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter"
        >
          Authentication Required
        </h3>
        <p className="text-zinc-700 dark:text-zinc-300">
          You need to be logged in to access this page.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-x-4">
          <Button
            href="/portal"
          >
            Sign in to continue
          </Button>
        </div>
      </AuthAreaContainer>
    );
  }

  return children;
}

function AuthAreaContainer({
  children
}: {
  readonly children: React.ReactNode;
}): React.ReactNode {
  return (
    <Card
      className="h-64 w-full bg-repeat flex flex-col sm:justify-center items-center"
      style={{
        backgroundImage: "url(/dots.svg)",
      }}
    >
      {children}
    </Card>
  );
}