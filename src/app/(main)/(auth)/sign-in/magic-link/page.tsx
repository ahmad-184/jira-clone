import { redirect } from "next/navigation";

import { getCurrentUserUncached } from "@/lib/session";
import MagicLink from "./magic-link";

export default async function Page() {
  const user = await getCurrentUserUncached();

  if (user) return redirect("/dashboard");

  return <MagicLink />;
}
