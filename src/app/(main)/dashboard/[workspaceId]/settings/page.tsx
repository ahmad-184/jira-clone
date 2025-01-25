import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import WorkspaceSettings from "./workspace-settings";

export const revalidate = 60; // 1 minute

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const user = await getCurrentUser();

  const { workspaceId } = await params;

  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full h-full flex flex-col gap-20">
      <div>
        <h1 className="text-4xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace settings here.
        </p>
      </div>
      <WorkspaceSettings workspaceId={workspaceId} />
    </div>
  );
}
