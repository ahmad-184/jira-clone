"use client";

import { useGetTasksQuery } from "@/hooks/queries/use-get-tasks";
import { useTaskFilters } from "../../components/task/hooks/use-task-filters";
import { useParams } from "next/navigation";

export const useTask = () => {
  const { projectId } = useParams<{ projectId: string | undefined }>();
  const { filters } = useTaskFilters(projectId);

  const { data: tasks, isPending: taskPending } = useGetTasksQuery(filters);

  return {
    tasks,
    loading: taskPending,
  };
};
