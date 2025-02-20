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
  MoreHorizontalIcon,
  PencilIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import { useState } from "react";
import DeleteTaskModal from "../delete-task-modal";
import Link from "next/link";
import { useWorkspace } from "@/hooks/workspace-provider";
import { TrashIcon } from "@/icons/trash-icon";

type Props = {
  id: string;
  projectId: string;
};

export default function ActionsMenu({ id, projectId }: Props) {
  const [open, setOpen] = useState(false);

  const { workspaceId } = useWorkspace();

  return (
    <div className="flex w-full justify-end">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link
            href={`/dashboard/${workspaceId}/task/${id}`}
            className="w-full"
          >
            <DropdownMenuItem>
              <SquareArrowOutUpRightIcon />
              Task Details
            </DropdownMenuItem>
          </Link>
          <Link
            href={`/dashboard/${workspaceId}/project/${projectId}`}
            className="w-full"
          >
            <DropdownMenuItem>
              <SquareArrowOutUpRightIcon />
              Open Project
            </DropdownMenuItem>
          </Link>
          <Link
            href={`/dashboard/${workspaceId}/task/${id}/edit`}
            className="w-full"
          >
            <DropdownMenuItem>
              <PencilIcon />
              Edit Task
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DeleteTaskModal taskIds={[id]}>
            <DropdownMenuItem
              onSelect={e => e.preventDefault()}
              className="!text-red-600 hover:!text-red-500"
            >
              <TrashIcon />
              Delete Task
            </DropdownMenuItem>
          </DeleteTaskModal>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
