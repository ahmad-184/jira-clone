import { getCurrentUserUncached } from "@/lib/session";
import MagicLink from "./magic-link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUserUncached();

  if (user) return redirect("/dashboard");

  return <MagicLink />;
}
