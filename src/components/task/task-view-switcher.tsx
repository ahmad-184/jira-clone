"use client";

import { useLocalStorage } from "usehooks-ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CreateTaskModal from "./create-task-modal";
import TaskDataFilter from "./task-data-filter";
import { useGetTasksQuery } from "@/hooks/queries/use-get-tasks";
import { useTaskFilters } from "./hooks/use-task-filters";
import LoaderIcon from "../loader-icon";
import TaskTable from "./table";

const TABS = [
  {
    title: "Table",
    value: "TABLE",
  },
  {
    title: "Kanban",
    value: "KANBAN",
  },
  {
    title: "Calendar",
    value: "CALENDAR",
  },
];

type Props = {
  projectId?: string;
};

export default function TaskViewSwitcher({ projectId }: Props) {
  const [value, setValue] = useLocalStorage("active_tab", "TABLE");

  const {
    assigneeFilter,
    dueDateFilter,
    projectFilter,
    searchFilter,
    statusFilter,
    workspaceFilter,
  } = useTaskFilters(projectId);

  const { data: tasks, isPending: taskPending } = useGetTasksQuery(
    workspaceFilter,
    projectFilter,
    statusFilter,
    assigneeFilter,
    dueDateFilter,
    searchFilter,
  );

  const onValueChanged = (value: string) => {
    setValue(value);
  };

  return (
    <div className="w-full">
      <Tabs onValueChange={onValueChanged} value={value ?? "TABLE"}>
        <div className="w-full flex py-2 items-center rounded-sm bg-shark-800/50 px-3">
          <div className="flex-1">
            <TabsList className="h-fit bg-transparent">
              {TABS.map(e => (
                <TabsTrigger
                  className={cn(
                    "data-[state=active]:bg-shark-900 px-5 py-3 text-sm relative",
                    {
                      "!text-blue-300 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:right-0 before:h-[4px] before:bg-blue-900 ":
                        e.value === value,
                    },
                  )}
                  value={e.value}
                  key={e.value}
                >
                  {e.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div>
            <CreateTaskModal>
              <Button>
                <PlusIcon /> New Task
              </Button>
            </CreateTaskModal>
          </div>
        </div>
        <div className="mt-3 w-full">
          <TaskDataFilter projectId={projectId} />
        </div>
        {!!taskPending && (
          <div className="w-full py-5 h-[150px] flex items-center justify-center">
            <LoaderIcon />
          </div>
        )}
        <div className="py-1" />
        {!taskPending && (
          <>
            <TabsContent value="TABLE">
              <TaskTable tasks={tasks} />
            </TabsContent>
            <TabsContent value="KANBAN">Kanban view</TabsContent>
            <TabsContent value="CALENDAR">Calendar view</TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
