import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export const revalidate = 60; // 1 minute

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return <div>Dashboard</div>;
}
