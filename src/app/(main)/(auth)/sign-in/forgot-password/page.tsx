import { redirect } from "next/navigation";

import { getCurrentUserUncached } from "@/lib/session";
import ForgotPassword from "./forgot-password";

export default async function Page() {
  const user = await getCurrentUserUncached();

  if (user) return redirect("/dashboard");

  return <ForgotPassword />;
}
