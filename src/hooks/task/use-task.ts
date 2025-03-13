"use client";

import { useParams } from "next/navigation";

import { useGetTasksQuery } from "@/hooks/queries/use-get-tasks";
import { useTaskFilters } from "../../components/task/hooks/use-task-filters";

export const useTask = () => {
  const { projectId } = useParams<{ projectId: string | undefined }>();
  const { filters } = useTaskFilters(projectId);

  const { data: tasks, isPending: taskPending } = useGetTasksQuery(filters);

  return {
    tasks,
    loading: taskPending,
  };
};
