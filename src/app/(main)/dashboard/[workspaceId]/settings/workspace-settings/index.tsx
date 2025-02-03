"use client";

import UpdateWorkspaceForm from "@/components/forms/update-workspace-form";
import { useGetWorkspaceQuery } from "@/hooks/queries/use-get-workspace";
import DeleteWorkspace from "./delete-workspace";
import ResetInviteCode from "./reset-invite-code";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useWorkspace } from "@/hooks/workspace-provider";

export default function WorkspaceSettings() {
  const { workspaceId } = useWorkspace();

  const { data, isPending } = useGetWorkspaceQuery(workspaceId);

  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);

  if (isPending) return <div>Loading...</div>;

  if (!data?.workspace) return null;
  if (!currentMember) return null;

  return (
    <div className="flex w-full max-w-6xl flex-col gap-16">
      <div className="w-full flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Workspace Settings</h1>
        <div className="p-7 rounded-xl dark:bg-zinc-900 bg-zinc-100">
          <UpdateWorkspaceForm
            workspace={data.workspace}
            currentMember={currentMember}
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-6">
        <div className="p-7 rounded-xl dark:bg-zinc-900 bg-zinc-100">
          <ResetInviteCode
            workspace={data.workspace}
            currentMember={currentMember}
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Delete Workspace</h1>
        <div className="p-7 rounded-xl dark:bg-zinc-900 bg-zinc-100">
          <DeleteWorkspace
            workspace={data.workspace}
            currentMember={currentMember}
          />
        </div>
      </div>
    </div>
  );
}
