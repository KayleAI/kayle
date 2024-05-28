"use client";

import { redirect } from "next/navigation";

export default function RedirectToDocs() {
  return redirect("https://docs.kayle.ai");
}