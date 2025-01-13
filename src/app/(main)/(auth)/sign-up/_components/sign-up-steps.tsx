"use client";

import { useRegisterStore } from "../store/register-store";
import SignUp from "./sign-up";
import VerifyEmail from "./verify-email";

export default function SignUpSteps() {
  const { step } = useRegisterStore(store => store);

  return (
    <div className="max-w-[400px] w-full space-y-6">
      {step === "register" && <SignUp />}
      {step === "verify" && <VerifyEmail />}
    </div>
  );
}
