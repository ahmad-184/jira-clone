"use client";

import UpdateProjectForm from "@/components/forms/update-project-form";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useGetProjectQuery } from "@/hooks/queries/use-get-project";
import { useWorkspace } from "@/hooks/workspace-provider";
import DeleteProject from "./delete-project";
import { Card } from "@/components/ui/card";

type Props = {
  projectId: string;
};

export default function ProjectSettings({ projectId }: Props) {
  const { workspaceId } = useWorkspace();

  const { data: project, isPending } = useGetProjectQuery(projectId);
  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);

  if (isPending) return <div>Loading...</div>;
  if (!project || !currentMember) return null;

  return (
    <div className="flex w-full max-w-6xl flex-col gap-16">
      <div className="w-full flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Project Settings</h1>
        <Card className="p-7 rounded-xl shadow-none">
          <UpdateProjectForm project={project} currentMember={currentMember} />
        </Card>
      </div>
      <div className="w-full flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Delete Project</h1>
        <Card className="p-7 rounded-xl shadow-none">
          <DeleteProject project={project} currentMember={currentMember} />
        </Card>
      </div>
    </div>
  );
}
