"use client";

import { useLocalStorage } from "usehooks-ts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetProjectQuery } from "@/hooks/queries/use-get-project";
import { Skeleton } from "../ui/skeleton";
import CreateTaskModal from "./create-task-modal";
import TaskDataFilter from "./task-data-filter";

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
  projectId: string;
};

export default function TaskViewSwitcher({ projectId }: Props) {
  const { isPending } = useGetProjectQuery(projectId);
  const [value, setValue] = useLocalStorage("active_tab", "TABLE");

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
            {!!isPending && <Skeleton className="h-10 w-[118px]" />}
            {!isPending && (
              <CreateTaskModal>
                <Button>
                  <PlusIcon /> New Task
                </Button>
              </CreateTaskModal>
            )}
          </div>
        </div>
        <div className="mt-4 w-full">
          <TaskDataFilter />
        </div>
        <TabsContent value="TABLE">Table view</TabsContent>
        <TabsContent value="KANBAN">Kanban view</TabsContent>
        <TabsContent value="CALENDAR">Calendar view</TabsContent>
      </Tabs>
    </div>
  );
}
