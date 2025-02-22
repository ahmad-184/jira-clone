"use client";

import { useWorkspace } from "@/hooks/workspace-provider";
import { TaskStatusEnum } from "@/types/task";
import { parseAsStringEnum, useQueryState, parseAsIsoDateTime } from "nuqs";
import { useEffect, useRef, useState } from "react";

type StatusQuery = TaskStatusEnum;

export const useTaskFilters = (projectId?: string) => {
  const [statusQuery, setStatusQuery] = useQueryState(
    "status",
    parseAsStringEnum<StatusQuery>(Object.values(TaskStatusEnum)),
  );
  const [assigneeQuery, setAssigneeQuery] = useQueryState("assignee");
  const [projectQuery, setProjectQuery] = useQueryState("project");
  const [searchQuery, setSearchQuery] = useQueryState("search");
  const [dueDateQuery, setDueDateQuery] = useQueryState(
    "due_date",
    parseAsIsoDateTime,
  );
  const [searchInput, setSearchInput] = useState("");

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { workspaceId } = useWorkspace();

  const onChangeStatus = (value: string) => {
    setStatusQuery(value === "ALL" ? null : (value as StatusQuery));
  };

  const onChangeAssignee = (value: string) => {
    setAssigneeQuery(value === "ALL" ? null : value);
  };

  const onChangeProject = (value: string | "ALL") => {
    setProjectQuery(value);
  };

  const onChangeDueDate = (value: Date | null) => {
    setDueDateQuery(value ? value : null);
  };

  const onChangeSearch = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(value.length ? value : null);
    }, 500);
  };

  const onChangeSearchInput = async (value: string) => {
    setSearchInput(value);
    onChangeSearch(value);
  };

  // useEffect(() => {
  //   onChangeSearch(searchInput);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchInput]);

  const workspaceFilter = workspaceId;
  const projectFilter =
    projectQuery === "ALL" ? undefined : projectQuery || projectId || undefined;
  const statusFilter = statusQuery || undefined;
  const assigneeFilter = assigneeQuery || undefined;
  const dueDateFilter = dueDateQuery || undefined;
  const searchFilter = searchQuery || undefined;

  return {
    workspaceFilter,
    projectFilter,
    assigneeFilter,
    statusFilter,
    dueDateFilter,
    searchFilter,
    onChangeStatus,
    onChangeAssignee,
    onChangeProject,
    onChangeSearch,
    onChangeDueDate,
    onChangeSearchInput,
    searchInput,
  };
};
