"use client";

import { useMemo } from "react";
import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GetTasksWithSearchQueriesUseCaseReturn } from "@/use-cases/types";
import ProjectIcon from "@/components/project/project-icon";
import Avatar from "@/components/avatar";
import { fDate } from "@/lib/format-time";
import { TaskStatusArray } from "@/constants";
import { TaskStatus } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ActionsMenu from "./actions-menu";

const sortStatusFn: SortingFn<
  GetTasksWithSearchQueriesUseCaseReturn[number]
> = (rowA, rowB) => {
  const statusA = rowA.original.status;
  const statusB = rowB.original.status;
  const statusOrder = TaskStatusArray;
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

const sortDateFn: SortingFn<GetTasksWithSearchQueriesUseCaseReturn[number]> = (
  rowA,
  rowB,
) => {
  const dateA = new Date(rowA.original.dueDate);
  const dateB = new Date(rowB.original.dueDate);
  return dateA.getTime() - dateB.getTime();
};

const sortNameFn: SortingFn<GetTasksWithSearchQueriesUseCaseReturn[number]> = (
  rowA,
  rowB,
) => {
  const nameA = rowA.original.name?.trim() || "";
  const nameB = rowB.original.name?.trim() || "";
  if (!nameA && !nameB) return 0;
  if (!nameA) return 1;
  if (!nameB) return -1;
  return nameA.localeCompare(nameB);
};

export const columns: ColumnDef<
  GetTasksWithSearchQueriesUseCaseReturn[number]
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="w-full h-full flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-full h-full flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task name
          <ArrowUpDown />
        </Button>
      );
    },
    sortingFn: sortNameFn,
    cell: ({ row }) => (
      <div className="capitalize text-sm">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "projectId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const task = row.original;

      return (
        <div className="flex flex-1 items-center gap-2">
          <div>
            <ProjectIcon project={task.project} className="size-6" />
          </div>
          <p className="font-semibold text-sm">{task.project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignedToMemberId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const task = row.original;

      return (
        <div className="flex flex-1 items-center gap-2">
          <div>
            <Avatar
              alt={`task assigned to ${task.assignedTo.user.profile.displayName}`}
              profile={task.assignedTo.user.profile}
              className="size-7"
            />
          </div>
          <p className="font-semibold text-sm">
            {task.assignedTo.user.profile.displayName}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown />
        </Button>
      );
    },
    sortingFn: sortDateFn,
    cell: ({ row }) => {
      const task = row.original;
      return (
        <div className="text-sm font-medium text-muted-foreground">
          {fDate(task.dueDate)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    sortingFn: sortStatusFn,
    cell: ({ row }) => {
      const task = row.original;
      return (
        <div className="text-sm font-medium capitalize">
          <TaskStatusBadge status={task.status} />
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;

      return <ActionsMenu id={task.id} projectId={task.projectId} />;
    },
  },
];

const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  const color = useMemo(() => {
    if (status === "BACKLOG") return "from-fuchsia-500 to-fuchsia-400";
    if (status === "TODO") return "from-orange-500 to-orange-400";
    if (status === "IN_PROGRESS") return "from-yellow-500 to-yellow-400";
    if (status === "IN_REVIEW") return "from-blue-500 to-blue-400";
    if (status === "DONE") return "from-emerald-500 to-emerald-400";
    return "bg-primary";
  }, [status]);

  return (
    <Badge
      className={cn(
        "capitalize select-none rounded-lg bg-gradient-to-t",
        color,
        `hover:${color}`,
      )}
    >
      {status.replaceAll("_", " ").toLowerCase()}
    </Badge>
  );
};
