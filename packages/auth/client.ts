"use client";

import { createAuthClient } from "better-auth/react";

export const client = createAuthClient();

export const { signIn, signOut, useSession } = client;
