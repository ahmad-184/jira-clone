import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import WorkspaceSettings from "./workspace-settings";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full h-full max-w-6xl flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace settings here.
        </p>
        <Separator className="mt-4" />
      </div>
      <WorkspaceSettings />
    </div>
  );
}
