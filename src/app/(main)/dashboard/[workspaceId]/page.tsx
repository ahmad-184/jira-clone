import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import WorkspaceDashboard from "./_components/workspace-dashboard";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full h-full flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          See your workspace analytics here.
        </p>
      </div>
      <WorkspaceDashboard />
    </div>
  );
}
