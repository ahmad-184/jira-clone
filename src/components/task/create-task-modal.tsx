"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DottedSeparator } from "../ui/dotted-separator";
import CreateTaskForm from "../forms/create-task-form";
import { useParams } from "next/navigation";
import { useGetWorkspaceProjectsQuery } from "@/hooks/queries/use-get-workspace-projects";
import { useWorkspace } from "@/hooks/workspace-provider";
import LoaderIcon from "../loader-icon";
import { useGetWorkspaceMembersQuery } from "@/hooks/queries/use-get-workspace-memebrs";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";

type Props = {
  children: React.ReactNode;
};

export default function CreateTaskModal({ children }: Props) {
  const [open, setOpen] = useState(false);

  const params = useParams<{ projectId: string }>();
  const { workspaceId } = useWorkspace();

  const { data: projects, isPending: projectsPending } =
    useGetWorkspaceProjectsQuery(workspaceId);
  const { data: currentMember, isPending: currentMemberPending } =
    useGetCurrentMemberQuery(workspaceId);
  const { data: workspaceMembers, isPending: workspaceMembersPending } =
    useGetWorkspaceMembersQuery(workspaceId);

  const isLoading =
    projectsPending || workspaceMembersPending || currentMemberPending;

  if (!currentMember) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Task</DialogTitle>
          <DialogDescription>
            Create a new project to start tracking your time.
          </DialogDescription>
        </DialogHeader>
        <DottedSeparator color="#454f59" />
        {!!isLoading && (
          <div className="flex w-full items-center justify-center min-w-[200px]">
            <LoaderIcon />
          </div>
        )}
        {!isLoading && (
          <CreateTaskForm
            projectId={params.projectId}
            workspaceMembers={workspaceMembers ?? []}
            projects={projects?.projects || []}
            currentMember={currentMember}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
