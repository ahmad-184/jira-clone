"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DottedSeparator } from "../ui/dotted-separator";
import { useGetWorkspaceProjectsQuery } from "@/hooks/queries/use-get-workspace-projects";
import { useWorkspace } from "@/hooks/workspace-provider";
import LoaderIcon from "../loader-icon";
import { useGetWorkspaceMembersQuery } from "@/hooks/queries/use-get-workspace-memebrs";
import UpdateTaskForm from "../forms/update-task-form";
import { GetTaskUseCaseReturn } from "@/use-cases/types";
import { useGetWorkspaceTagsQuery } from "@/hooks/queries/use-get-workspace-tags";

type Props = {
  children: React.ReactNode;
  task: GetTaskUseCaseReturn;
};

export default function UpdateTaskModal({ children, task }: Props) {
  const [open, setOpen] = useState(false);

  const { workspaceId } = useWorkspace();

  const { data: projects, isPending: projectsPending } =
    useGetWorkspaceProjectsQuery(workspaceId);
  const { data: workspaceMembers, isPending: workspaceMembersPending } =
    useGetWorkspaceMembersQuery(workspaceId);
  const { data: tags, isPending: workspaceTagsPending } =
    useGetWorkspaceTagsQuery(workspaceId);

  const isLoading =
    projectsPending || workspaceMembersPending || workspaceTagsPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer" onClick={() => setOpen(true)}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update the Task</DialogTitle>
        </DialogHeader>
        <DottedSeparator color="#454f59" />
        {!!isLoading && (
          <div className="flex w-full items-center justify-center min-h-[200px]">
            <LoaderIcon />
          </div>
        )}
        {!isLoading && (
          <UpdateTaskForm
            workspaceMembers={workspaceMembers ?? []}
            projects={projects?.projects || []}
            onClose={() => setOpen(false)}
            task={task}
            taskId={task.id}
            tags={tags ?? []}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
