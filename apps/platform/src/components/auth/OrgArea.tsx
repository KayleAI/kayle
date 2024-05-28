"use client";

import { useAuth } from "@/utils/auth/AuthProvider";
import { useOrg } from "@/utils/auth/OrgProvider";
import { Button } from "@repo/ui/button";
import { Card } from "@/components/card";

const possibleRoles = [
  "owner",
  "admin",
  "billing",
  "manager",
  "moderator",
  "developer"
]

type PossibleRole = (typeof possibleRoles)[number];

export function OrgArea({
  authRequired = false,
  acceptRoles = [],
  loading = false,
  children
}: {
  readonly authRequired?: boolean;
  readonly acceptRoles?: PossibleRole[] | "any";
  readonly loading?: boolean;
  readonly children: React.ReactNode;
}): React.ReactNode {
  const user = useAuth();
  const orgs = useOrg();

  if (user?.authStatus === "loading" || orgs?.orgStatus === "loading") {
    return (
      <AuthAreaContainer>
        <h3
          className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter"
        >
          Loading...
        </h3>
        <p className="text-zinc-700 dark:text-zinc-300">
          Please wait while we check your organisation authentication status.
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

  if (acceptRoles !== "any" && acceptRoles.length > 0) {
    if (!acceptRoles.includes(orgs?.activeOrg?.role as PossibleRole)) {
      return (
        <AuthAreaContainer>
          <h3
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter"
          >
            Access Denied
          </h3>
          <p className="text-zinc-700 dark:text-zinc-300">
            Contact your organisation administrator for access.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-x-4">
            <Button plain disabled>
              Access Denied
            </Button>
          </div>
        </AuthAreaContainer>
      );
    }
  }

  if (loading) {
    return (
      <AuthAreaContainer>
        <h3
          className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter"
        >
          Please wait while we load your data
        </h3>
        <p className="text-zinc-700 dark:text-zinc-300">
          Loading your organisation data.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-x-4">
          <Button plain disabled>
            Loading...
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