"use client";

import { parseAsStringEnum, useQueryState, parseAsIsoDateTime } from "nuqs";
import { TaskStatus } from "@/db/schema";
import { TaskStatusEnum } from "@/types/task";
import { useEffect, useRef, useState } from "react";

export const useTaskFilters = () => {
  const [statusQuery, setStatusQuery] = useQueryState(
    "status",
    parseAsStringEnum<TaskStatus>(Object.values(TaskStatusEnum)),
  );
  const [assigneeQuery, setAssigneeQuery] = useQueryState("assignee");
  const [projectQuery, setProjectQuery] = useQueryState("project");
  const [searchQuery, setSearchQuery] = useQueryState("search");
  const [dueDateQuery, setDueDateQuery] = useQueryState(
    "due_date",
    parseAsIsoDateTime,
  );
  const [searchValue, setSearchValue] = useState("");

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onChangeStatus = (value: string) => {
    setStatusQuery(value === "ALL" ? null : (value as TaskStatus));
  };

  const onChangeAssignee = (value: string) => {
    setAssigneeQuery(value === "ALL" ? null : value);
  };

  const onChangeProject = (value: string) => {
    setProjectQuery(value === "ALL" ? null : value);
  };

  const onChangeDueDate = (value: Date | null) => {
    setDueDateQuery(value);
  };

  const onChangeSearch = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(value.length ? value : null);
    }, 500);
  };

  useEffect(() => {
    onChangeSearch(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return {
    statusQuery,
    onChangeStatus,
    assigneeQuery,
    onChangeAssignee,
    projectQuery,
    onChangeProject,
    searchQuery,
    onChangeSearch,
    dueDateQuery,
    onChangeDueDate,
    searchValue,
    setSearchValue,
  };
};
