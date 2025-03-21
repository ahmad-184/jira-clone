import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getMemberUseCase } from "@/use-cases/members";
import MembersList from "./members-list";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  const currentMember = await getMemberUseCase(user.id, workspaceId);

  if (!currentMember) return redirect("/dashboard");

  return (
    <div className="w-full h-full max-w-6xl flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold mb-1">Members</h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          {currentMember.role === "MEMBER"
            ? "See all members of workspace."
            : `Manage and view all members of this workspace. Control access levels and permissions for collaborative work.`}
        </p>
      </div>
      <div>
        <MembersList />
      </div>
    </div>
  );
}
