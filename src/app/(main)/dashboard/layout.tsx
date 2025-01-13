import { getCurrentUserUncached } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserUncached();

  if (!user) return redirect("/sign-in");

  return <div>{children}</div>;
}
