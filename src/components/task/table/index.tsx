"use client";

import { GetTasksWithSearchQueriesUseCaseReturn } from "@/use-cases/types";
import DataTable from "./data-table";

type Props = {
  tasks: GetTasksWithSearchQueriesUseCaseReturn | undefined;
};

export default function TaskTable({ tasks }: Props) {
  return <DataTable data={tasks || []} />;
}
