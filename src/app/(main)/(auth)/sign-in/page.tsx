import { redirect } from "next/navigation";

import { getCurrentUserUncached } from "@/lib/session";
import SignIn from "./_components/sign-in";

export default async function Page() {
  const user = await getCurrentUserUncached();

  if (user) return redirect("/dashboard");

  return <SignIn />;
}
