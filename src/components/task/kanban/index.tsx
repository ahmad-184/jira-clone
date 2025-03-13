"use client";

import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

import { GetTaskUseCaseReturn } from "@/use-cases/types";
import { TaskStatus } from "@/db/schema";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";
import { useUpdateTaskPositionMutation } from "../hooks/mutations/use-update-task-position";
import { useWorkspace } from "@/hooks/workspace-provider";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useTaskRealtime } from "@/providers/task-realtime-provider";

type Props = {
  tasks: GetTaskUseCaseReturn[] | undefined;
};
type TaskState = Record<TaskStatus, GetTaskUseCaseReturn[]>;

export default function TaskKanban({ tasks }: Props) {
  const [boardState, setBoardState] = useState<TaskState>({
    BACKLOG: [],
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
  });

  const { workspaceId } = useWorkspace();
  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);
  const { updateTasksOptimistic, broadcastUpdatedTasks } = useTaskRealtime();

  const { mutate: updateTasksPosition } = useUpdateTaskPositionMutation({
    onSuccess: res => {
      if (!res.tasks.length) return;
      const tasks = res.tasks.map(e => ({ ...e, workspaceId }));
      broadcastUpdatedTasks(tasks);
    },
  });

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const from = result.source;
      const to = result.destination;

      if (!from || !to) return;

      const fromBoard = boardState[from.droppableId as TaskStatus];
      const toBoard = boardState[to.droppableId as TaskStatus];

      const [movedTask] = fromBoard.splice(from.index, 1);
      toBoard.splice(to.index, 0, movedTask);

      fromBoard.forEach((task, index) => {
        task["position"] = index;
        task["status"] = from.droppableId as TaskStatus;
      });

      toBoard.forEach((task, index) => {
        task["position"] = index;
        task["status"] = to.droppableId as TaskStatus;
      });

      const toUpdate = [...fromBoard, ...toBoard].map(task => ({
        id: task.id,
        position: task.position,
        status: task.status,
      }));

      updateTasksOptimistic(toUpdate);
      updateTasksPosition({
        json: {
          workspaceId,
          tasks: toUpdate,
        },
      });
    },
    [boardState, workspaceId, updateTasksPosition, updateTasksOptimistic],
  );

  useEffect(() => {
    if (!tasks || !tasks?.length) return;

    const board: TaskState = {
      BACKLOG: [],
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
    };

    for (const t of tasks) {
      board[t.status].push({ ...t });
    }

    for (const b of Object.entries(board)) {
      b[1].sort((a, b) => a.position - b.position);
    }

    setBoardState(board);
  }, [tasks]);

  if (!currentMember) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full">
        <div className="w-full flex flex-row gap-4 items-start pb-3 overflow-x-auto overflow-y-visible">
          {Object.entries(boardState).map(board => (
            <div
              key={board[0]}
              className="flex-1 bg-background rounded-lg min-w-[250px] py-2 px-1"
            >
              <KanbanColumnHeader
                taskCount={board[1].length}
                board={board[0] as TaskStatus}
              />
              <Droppable droppableId={board[0]}>
                {dropProvided => (
                  <div
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    className="py-1.5 transition-all min-h-screen duration-150 overflow-y-visible"
                  >
                    {board[1].map((b, i) => (
                      <KanbanCard
                        key={b.id}
                        board={b}
                        index={i}
                        currentMember={currentMember}
                      />
                    ))}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
