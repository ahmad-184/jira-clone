import { redirect } from "next/navigation";

import { getCurrentUserUncached } from "@/lib/session";
import SignUpSteps from "./_components/sign-up-steps";

export default async function Page() {
  const user = await getCurrentUserUncached();

  if (user) return redirect("/dashboard");

  return <SignUpSteps />;
}
