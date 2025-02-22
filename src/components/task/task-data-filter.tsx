"use client";

import { useGetWorkspaceMembersQuery } from "@/hooks/queries/use-get-workspace-memebrs";
import { useGetWorkspaceProjectsQuery } from "@/hooks/queries/use-get-workspace-projects";
import { useWorkspace } from "@/hooks/workspace-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TASK_STATUS } from "@/constants/forms";
import { ListChecksIcon } from "lucide-react";
import { UserIcon } from "@/icons/user-icon";
import { Skeleton } from "../ui/skeleton";
import { FolderIcon } from "@/icons/folder-icon";
import { useTaskFilters } from "./hooks/use-task-filters";
import DatePickerPopover from "../custom/date-picker-popover";
import { Button } from "../ui/button";
import SearchInput from "../custom/search-input";

type Props = {
  projectId?: string;
};

export default function TaskDataFilter({ projectId }: Props) {
  const { workspaceId } = useWorkspace();

  const {
    onChangeStatus,
    onChangeAssignee,
    onChangeDueDate,
    onChangeProject,
    assigneeFilter,
    dueDateFilter,
    projectFilter,
    searchInput,
    searchFilter,
    statusFilter,
    onChangeSearchInput,
  } = useTaskFilters(projectId);

  const { data: projects, isPending: projectsPending } =
    useGetWorkspaceProjectsQuery(workspaceId);
  const { data: workspaceMembers, isPending: workspaceMembersPending } =
    useGetWorkspaceMembersQuery(workspaceId);

  return (
    <div className="w-full flex flex-row flex-wrap gap-4 items-center">
      <p className="text-muted-foreground text-sm">Filters: </p>
      {/* Filter with status */}
      <Select defaultValue={statusFilter} onValueChange={onChangeStatus}>
        <SelectTrigger className="w-fit text-sm h-10 rounded-lg bg-shark-800/50">
          <div className="flex items-center gap-2 pr-1 capitalize">
            <ListChecksIcon className="size-4" />
            <SelectValue placeholder="Status" className="capitalize" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"ALL"} className="capitalize">
            All Statuses
          </SelectItem>
          <SelectSeparator />
          {TASK_STATUS.map((m, i) => (
            <SelectItem value={m} key={`${m}-${i}`} className="capitalize">
              {m.replaceAll("_", " ").toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Filter with assignee */}
      {!!workspaceMembersPending && (
        <Skeleton className="h-10 w-36 rounded-lg" />
      )}
      {!workspaceMembersPending && (
        <Select defaultValue={assigneeFilter} onValueChange={onChangeAssignee}>
          <SelectTrigger className="w-fit h-10 rounded-lg bg-shark-800/50">
            <div className="flex items-center gap-2 pr-1 capitalize">
              <UserIcon className="size-4" />
              <SelectValue placeholder="Assignee" className="capitalize" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"ALL"} className="capitalize">
              All Assignees
            </SelectItem>
            <SelectSeparator />
            {workspaceMembers?.map((m, i) => (
              <SelectItem
                value={m.id}
                key={`${m.id}-${i}`}
                className="capitalize"
              >
                {m.user.profile.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {/* Filter with projects */}
      {!!projectsPending && <Skeleton className="h-10 w-36 rounded-lg" />}
      {!projectsPending && (
        <Select onValueChange={onChangeProject} defaultValue={projectFilter}>
          <SelectTrigger className="w-fit h-10 rounded-lg bg-shark-800/50">
            <div className="flex items-center gap-2 pr-1 capitalize">
              <FolderIcon className="size-4" />
              <SelectValue placeholder="Project" className="capitalize" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"ALL"} className="capitalize">
              All Projects
            </SelectItem>
            <SelectSeparator />
            {projects?.projects?.map((p, i) => (
              <SelectItem
                value={p.id}
                key={`${p.id}-${i}`}
                className="capitalize"
              >
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex gap-2 items-center">
        <DatePickerPopover
          value={dueDateFilter}
          onChange={onChangeDueDate}
          className="w-fit h-10 !bg-shark-800/50 rounded-lg text-primary"
          label="Due Date"
        />
        {!!dueDateFilter && (
          <Button
            variant={"outline"}
            type="button"
            className="h-10"
            onClick={() => onChangeDueDate(null)}
          >
            Reset
          </Button>
        )}
      </div>
      <div className="flex-1">
        <SearchInput
          value={searchInput.length ? searchInput : undefined}
          defaultValue={searchFilter}
          onChange={e => onChangeSearchInput(e.target.value)}
          className="h-10 max-w-[300px] min-w-[250px] bg-shark-800/50"
        />
      </div>
    </div>
  );
}
