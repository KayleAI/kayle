"use client";

import { useAuth } from "@/utils/auth/AuthProvider";

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
    <div
      className="border border-zinc-200 dark:border-zinc-800 rounded-xl h-64 w-full bg-repeat flex flex-col sm:justify-center items-center"
      style={{
        backgroundImage: "url(/dots.svg)",
      }}
    >
      {children}
    </div>
  );
}