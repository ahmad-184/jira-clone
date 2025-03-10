"use client";

import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useWorkspace } from "@/hooks/workspace-provider";
import DashboardAssignedTasks from "./dashboard-assigned-task";
import DashboardMembers from "./dashboard-members";
import DashboardProjects from "./dashboard-projects";
import DashboardAnalytics from "./dashboard-analytics";

export default function WorkspaceDashboard() {
  const { workspaceId } = useWorkspace();

  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);

  if (!currentMember) return null;

  return (
    <div className="w-full flex flex-col gap-5">
      <DashboardAnalytics />
      <div className="w-full flex gap-5 flex-col lg:flex-row">
        <div className="flex-1 flex flex-col gap-5">
          <DashboardAssignedTasks memberId={currentMember.id} />
          <DashboardMembers />
        </div>
        <div className="flex-1">
          <DashboardProjects />
        </div>
      </div>
    </div>
  );
}
