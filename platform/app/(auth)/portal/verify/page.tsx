import { Suspense } from "react";
import VerifyLogin from "./verify";

export default function VerifyLoginPage() {
  return (
    <Suspense>
      <VerifyLogin />
    </Suspense>
  )
}