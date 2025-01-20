import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return <div>Dashboard</div>;
}
