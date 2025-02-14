"use client";

import UpdateWorkspaceForm from "@/components/forms/update-workspace-form";
import { useGetWorkspaceQuery } from "@/hooks/queries/use-get-workspace";
import DeleteWorkspace from "./delete-workspace";
import ResetInviteCode from "./reset-invite-code";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useWorkspace } from "@/hooks/workspace-provider";
import { Card } from "@/components/ui/card";

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
        <Card className="p-7 shadow-none">
          <div className="w-full flex flex-col gap-7 lg:!flex-row lg:!gap-16">
            <div className="flex-1 lg:max-w-[23%]">
              <p className="text-sm font-semibold">General settings</p>
            </div>
            <div className="flex-1">
              <UpdateWorkspaceForm
                workspace={data.workspace}
                currentMember={currentMember}
              />
            </div>
          </div>
        </Card>
      </div>
      <div className="w-full flex flex-col gap-6">
        <Card className="p-7 rounded-xl shadow-none">
          <ResetInviteCode
            workspace={data.workspace}
            currentMember={currentMember}
          />
        </Card>
      </div>
      <div className="w-full flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Delete Workspace</h1>
        <Card className="p-7 rounded-xl shadow-none">
          <DeleteWorkspace
            workspace={data.workspace}
            currentMember={currentMember}
          />
        </Card>
      </div>
    </div>
  );
}
