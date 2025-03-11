"use client";

import { GetTaskUseCaseReturn } from "@/use-cases/types";
import DataTable from "./data-table";

type Props = {
  tasks: GetTaskUseCaseReturn[];
};

export default function TaskTable({ tasks }: Props) {
  return <DataTable data={tasks} />;
}
