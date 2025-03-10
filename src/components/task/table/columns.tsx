"use client";

import { ColumnDef, Row, SortingFn, Table } from "@tanstack/react-table";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GetTaskUseCaseReturn } from "@/use-cases/types";
import ProjectIcon from "@/components/project/project-icon";
import Avatar from "@/components/avatar";
import { fDate } from "@/lib/format-time";
import { TaskStatusArray } from "@/constants";
import ActionsMenu from "../actions-menu";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { usePermission } from "@/hooks/use-permission";
import Link from "next/link";
import TaskStatusBadge from "../task-status-badge";

const sortStatusFn: SortingFn<GetTaskUseCaseReturn> = (rowA, rowB) => {
  const statusA = rowA.original.status;
  const statusB = rowB.original.status;
  const statusOrder = TaskStatusArray;
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

const sortDateFn: SortingFn<GetTaskUseCaseReturn> = (rowA, rowB) => {
  const dateA = new Date(rowA.original.dueDate);
  const dateB = new Date(rowB.original.dueDate);
  return dateA.getTime() - dateB.getTime();
};

const sortNameFn: SortingFn<GetTaskUseCaseReturn> = (rowA, rowB) => {
  const nameA = rowA.original.name?.trim() || "";
  const nameB = rowB.original.name?.trim() || "";
  if (!nameA && !nameB) return 0;
  if (!nameA) return 1;
  if (!nameB) return -1;
  return nameA.localeCompare(nameB);
};

export const columns: ColumnDef<GetTaskUseCaseReturn>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectHeader table={table} />,
    cell: ({ row }) => <SelectCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="min-w-[150px]">
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Task name
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    sortingFn: sortNameFn,
    cell: ({ row }) => (
      <Link
        href={`/dashboard/${row.original.workspaceId}/task/${row.original.id}`}
        className="capitalize text-sm font-medium hover:underline hover:text-blue-500"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "projectId",
    header: ({ column }) => {
      return (
        <div className="min-w-[150px]">
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project
            <ArrowUpDown />
          </Button>
        </div>
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
        <div className="min-w-[150px]">
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Assignee
            <ArrowUpDown />
          </Button>
        </div>
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
        <div className="min-w-[150px]">
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due Date
            <ArrowUpDown />
          </Button>
        </div>
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
        <div className="min-w-[100px]">
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        </div>
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
      return (
        <div className="flex w-full justify-end">
          <ActionsMenu
            task={task}
            trigger={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVerticalIcon />
              </Button>
            }
          />
        </div>
      );
    },
  },
];

function SelectHeader({ table }: { table: Table<GetTaskUseCaseReturn> }) {
  return (
    <div className="w-full h-full flex items-center justify-center min-w-[30px]">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
}

function SelectCell({ row }: { row: Row<GetTaskUseCaseReturn> }) {
  const task = row.original;

  const { data: currentMember } = useGetCurrentMemberQuery(task.workspaceId);

  const permission = usePermission(currentMember!.role, "tasks", "delete", {
    member: currentMember!,
    task,
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Checkbox
        disabled={!permission.permission}
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
}
