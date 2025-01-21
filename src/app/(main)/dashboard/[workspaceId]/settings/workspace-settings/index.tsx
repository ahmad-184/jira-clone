"use client";

import UpdateWorkspaceForm from "@/components/forms/update-workspace-form";
import { useGetWorkspaceQuery } from "@/hooks/queries/use-get-workspace";
import DeleteWorkspace from "./delete-workspace";

type Props = {
  workspaceId: string;
};

export default function WorkspaceSettings({ workspaceId }: Props) {
  const { data, isPending } = useGetWorkspaceQuery(workspaceId);

  if (isPending) return <div>Loading...</div>;

  if (!data?.workspace) return null;

  return (
    <div className="flex w-full max-w-6xl flex-col gap-16">
      <div className="w-full flex flex-col gap-6">
        <h1 className="text-lg font-semibold">Workspace Settings</h1>
        <div className="p-7 rounded-xl bg-zinc-900">
          <UpdateWorkspaceForm workspace={data.workspace} />
        </div>
      </div>
      <div className="w-full flex flex-col gap-6">
        <h1 className="text-lg font-semibold">Delete Workspace</h1>
        <div className="p-7 rounded-xl bg-zinc-900">
          <DeleteWorkspace workspace={data.workspace} />
        </div>
      </div>
    </div>
  );
}
