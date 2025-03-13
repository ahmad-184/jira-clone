"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";

import LoaderIcon from "@/components/loader-icon";
import { useGetTaskQuery } from "@/hooks/queries/use-get-task";
import { useWorkspace } from "@/hooks/workspace-provider";
import TaskBreadcrumb from "./task-breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteTaskModal from "@/components/modals/delete-task-modal";
import { TrashIcon } from "@/icons/trash-icon";
import { buttonVariants } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import Avatar from "@/components/avatar";
import { fDate } from "@/lib/format-time";
import UpdateTaskModal from "@/components/modals/update-task-modal";
import { Textarea } from "@/components/ui/textarea";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { usePermission } from "@/hooks/use-permission";
import TaskTag from "@/components/task/task-tag";
import TaskStatusBadge from "@/components/task/task-status-badge";
import { useUpdateTaskMutation } from "@/hooks/mutations/use-update-task-mutation";
import { useTaskRealtime } from "@/providers/task-realtime-provider";

type Props = {
  taskId: string;
};

export default function TaskDetails({ taskId }: Props) {
  const [description, setDescription] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { workspaceId } = useWorkspace();
  const router = useRouter();

  const { data, isLoading } = useGetTaskQuery(workspaceId, taskId);
  const { data: currentMember, isPending: currentMemberLoading } =
    useGetCurrentMemberQuery(workspaceId);

  const { broadcastUpdatedTasks, updateTasksOptimistic } = useTaskRealtime();

  const { mutate: updateTask } = useUpdateTaskMutation({
    onSuccess: ({ task }) => {
      broadcastUpdatedTasks([task]);
      updateTasksOptimistic([task]);
    },
  });

  const canUpdate = usePermission(currentMember!.role, "tasks", "update", {
    member: currentMember!,
    task: data!,
  });

  const canDelete = usePermission(currentMember!.role, "tasks", "delete", {
    member: currentMember!,
    task: data!,
  });

  const onDeleteCallback = () => {
    if (!data) return;
    router.push(`/dashboard/${workspaceId}/project/${data.project.id}`);
  };

  const onUpdateDescription = useCallback(
    (value: string) => {
      if (!data) return;
      setDescription(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        updateTask({
          json: {
            id: data.id,
            workspaceId: data.workspaceId,
            description: value.length > 0 ? value : null,
          },
        });
      }, 1000);
    },
    [data, updateTask],
  );

  useEffect(() => {
    if (!data) return;
    setDescription(data.description ?? "");
  }, [data]);

  if (isLoading || currentMemberLoading)
    return (
      <div className="w-full h-[200px] flex items-center justify-center">
        <LoaderIcon />
      </div>
    );

  if (!data || !currentMember || !canUpdate || !canDelete) return null;

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <TaskBreadcrumb task={data} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Overview</CardTitle>
          <div className="flex flex-row gap-4">
            {!!canUpdate.permission && (
              <UpdateTaskModal task={data}>
                <div
                  className={buttonVariants({
                    size: "icon",
                    variant: "ghost",
                  })}
                >
                  <PencilIcon className="!size-4 text-yellow-500" />
                </div>
              </UpdateTaskModal>
            )}
            {!!canDelete.permission && (
              <DeleteTaskModal
                taskIds={[data.id]}
                onCallback={onDeleteCallback}
              >
                <div
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                  })}
                >
                  <TrashIcon className="text-red-500 !size-4" />
                </div>
              </DeleteTaskModal>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DottedSeparator />
          <br />
          <div className="flex flex-col md:flex-row lg:gap-24 gap-14 xl:gap-36">
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-10 items-start">
                <p className="text-muted-foreground text-sm">Assignee</p>
                <div className="flex items-center gap-2">
                  <Avatar
                    profile={data.assignedTo.user.profile}
                    alt={data.assignedTo.user.profile.displayName ?? ""}
                    className="size-8"
                  />
                  <p className="text-sm">
                    {data.assignedTo.user.profile.displayName}
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-10 items-start">
                <p className="text-muted-foreground text-sm">Due Date</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{fDate(data.dueDate)}</p>
                </div>
              </div>
              <div className="flex flex-row gap-10 items-start">
                <p className="text-muted-foreground text-sm">Status</p>
                <div className="flex flex-row items-center gap-2">
                  <TaskStatusBadge status={data.status} />
                </div>
              </div>
              <div className="flex flex-row gap-10 items-start">
                <p className="text-muted-foreground text-sm">Tags</p>
                <div className="flex flex-row items-center gap-2">
                  {data.taskTags.map(t => (
                    <TaskTag key={t.tag.id} data={t.tag} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-row gap-10 items-start">
                <p className="text-muted-foreground text-sm">Description</p>
                <div className="flex-1">
                  <Textarea
                    className="resize-none w-full disabled:opacity-100 disabled:cursor-not-allowed"
                    placeholder={
                      canUpdate.permission
                        ? "Add a description..."
                        : "No description"
                    }
                    value={description}
                    disabled={!canUpdate.permission}
                    rows={5}
                    onChange={e => onUpdateDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
