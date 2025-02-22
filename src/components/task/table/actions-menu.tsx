import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVerticalIcon,
  PencilIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import { useState } from "react";
import DeleteTaskModal from "../delete-task-modal";
import Link from "next/link";
import { useWorkspace } from "@/hooks/workspace-provider";
import { TrashIcon } from "@/icons/trash-icon";
import UpdateTaskModal from "../update-task-modal";
import { GetTaskUseCaseReturn } from "@/use-cases/types";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { usePermission } from "@/hooks/use-permission";

type Props = {
  task: GetTaskUseCaseReturn;
};

export default function ActionsMenu({ task }: Props) {
  const [open, setOpen] = useState(false);

  const { workspaceId } = useWorkspace();

  const { data: currentMember, isPending: currentMemberPending } =
    useGetCurrentMemberQuery(workspaceId);

  const canEdit = usePermission(currentMember!.role, "tasks", "update", {
    task,
    member: currentMember!,
  });
  const canDelete = usePermission(currentMember!.role, "tasks", "delete", {
    task,
    member: currentMember!,
  });

  if (currentMemberPending) return;

  return (
    <div className="flex w-full justify-end">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link
            href={`/dashboard/${workspaceId}/task/${task.id}`}
            className="w-full"
          >
            <DropdownMenuItem>
              <SquareArrowOutUpRightIcon />
              Task Details
            </DropdownMenuItem>
          </Link>
          <Link
            href={`/dashboard/${workspaceId}/project/${task.projectId}`}
            className="w-full"
          >
            <DropdownMenuItem>
              <SquareArrowOutUpRightIcon />
              Open Project
            </DropdownMenuItem>
          </Link>
          {!!canEdit.permission && (
            <UpdateTaskModal task={task}>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <PencilIcon />
                Edit Task
              </DropdownMenuItem>
            </UpdateTaskModal>
          )}
          {!!canDelete.permission && <DropdownMenuSeparator />}
          {!!canDelete.permission && (
            <DeleteTaskModal taskIds={[task.id]}>
              <DropdownMenuItem
                onSelect={e => e.preventDefault()}
                className="!text-red-600 hover:!text-red-500"
              >
                <TrashIcon />
                Delete Task
              </DropdownMenuItem>
            </DeleteTaskModal>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
