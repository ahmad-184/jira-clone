"use client";

import { useMemo } from "react";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
} from "lucide-react";

import { statusNames } from "@/constants/status";
import { TaskStatus } from "@/db/schema";

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  BACKLOG: <CircleDashedIcon className="size-[15px] text-pink-400" />,
  TODO: <CircleIcon className="size-[15px] text-red-400" />,
  IN_PROGRESS: <CircleDotDashedIcon className="size-[15px] text-yellow-400" />,
  IN_REVIEW: <CircleDotIcon className="size-[15px] text-blue-400" />,
  DONE: <CircleCheckIcon className="size-[15px] text-emerald-400" />,
};

type Props = {
  board: TaskStatus;
  taskCount: number;
};

export default function KanbanColumnHeader({ board, taskCount }: Props) {
  const icon = useMemo(() => statusIcons[board], [board]);
  const name = useMemo(() => statusNames[board], [board]);

  return (
    <div className="w-full flex gap-2 items-center p-2">
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <h2 className="capitalize text-xs text-muted-foreground font-semibold">
          {name}
        </h2>
        <p className="text-xs text-muted-foreground font-semibold">
          {taskCount}
        </p>
      </div>
    </div>
  );
}
