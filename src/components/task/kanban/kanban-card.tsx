import { GetTaskUseCaseReturn } from "@/use-cases/types";
import ActionsMenu from "../actions-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { truncateString } from "@/util/truncate-string";
import { cn } from "@/lib/utils";
import Avatar from "@/components/avatar";
import { fDate } from "@/lib/format-time";
import ProjectIcon from "@/components/project/project-icon";
import { Draggable } from "@hello-pangea/dnd";
import { Member } from "@/db/schema";
import { usePermission } from "@/hooks/use-permission";
import TaskTag from "../task-tag";

type Props = {
  board: GetTaskUseCaseReturn;
  index: number;
  currentMember: Member;
};

export default function KanbanCard({ board, index, currentMember }: Props) {
  const canUpdate = usePermission(currentMember.role, "tasks", "update", {
    member: currentMember,
    task: board,
  });

  return (
    <Draggable
      key={board.id}
      draggableId={board.id}
      index={index}
      isDragDisabled={!canUpdate.permission}
    >
      {(dragProvided, { isDragging }) => (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          style={dragProvided.draggableProps.style}
        >
          <div className="bg-shark-900 rounded">
            <div
              className={cn(
                "w-full flex flex-col transition-all duration-150 rounded bg-shark-900 shadow-sm p-2.5 mb-1.5 gap-2",
                {
                  "outline outline-yellow-600 outline-1 bg-yellow-600/5":
                    !!isDragging,
                },
              )}
            >
              <div className="w-full flex items-center justify-between gap-x-2">
                <p className="text-sm text-shark-300 font-medium flex-1 break-words">
                  {board.name}
                </p>
                <ActionsMenu
                  task={board}
                  trigger={
                    <div className="cursor-pointer">
                      <MoreHorizontalIcon className="size-[18px] text-muted-foreground" />
                    </div>
                  }
                />
              </div>
              <div className="w-full flex items-center gap-2">
                <div className="p-[2.3px] rounded-full bg-shark-600" />
                <p className="text-xs text-muted-foreground">
                  {fDate(board.createdAt)}
                </p>
              </div>
              <div className="w-full">
                <p className="text-sm text-muted-foreground">
                  {board.description ? (
                    truncateString(board.description)
                  ) : (
                    <span className="text-xs text-shark-500">
                      ...No description...
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-1.5">
                {board.taskTags.map(t => (
                  <TaskTag key={t.tag.id} data={t.tag} />
                ))}
              </div>
              <div className="w-full my-1">
                <DottedSeparator />
              </div>
              <div className="w-full flex items-center justify-between gap-5">
                <div className="flex items-center gap-1 truncate">
                  <Avatar
                    className="size-5"
                    profile={board.assignedTo.user.profile}
                    alt={board.assignedTo.user.email}
                  />
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {board.assignedTo.user.profile.displayName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ProjectIcon className="size-5" project={board.project} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
