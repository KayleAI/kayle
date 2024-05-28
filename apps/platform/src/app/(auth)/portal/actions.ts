"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(
    {
      email: email,
      password: password,
    },
  );

  return {
    error: !!error,
    message: error?.message,
  };
}

export async function signup(email: string, password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_CONSOLE_URL,
    },
  });

  return {
    error: !!error,
    message: error?.message,
  };
}

export async function magicOtp(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: process.env.NODE_ENV === "production"
        ? "https://kayle.ai/"
        : "http://localhost:2800/",
    },
  });

  return {
    error: !!error,
    message: error?.message,
  };
}

export async function verifyOtp(email: string, otp: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.verifyOtp({
    email: email,
    type: "email",
    token: otp,
  });

  return {
    error: !!error,
    message: error?.message,
  };
}