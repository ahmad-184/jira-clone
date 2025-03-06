"use client";

import { useLocalStorage } from "usehooks-ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlignStartHorizontalIcon,
  CalendarIcon,
  PlusIcon,
  Table2Icon,
} from "lucide-react";
import CreateTaskModal from "../modals/create-task-modal";
import TaskDataFilter from "./task-data-filter";
import LoaderIcon from "../loader-icon";
import TaskTable from "./table";
import DeleteTaskModal from "../modals/delete-task-modal";
import { TrashIcon } from "@/icons/trash-icon";
import { useMemo } from "react";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useWorkspace } from "@/hooks/workspace-provider";
import TaskKanban from "./kanban";
import { useTask } from "../../hooks/task/use-task";

const TABS = [
  {
    icon: <Table2Icon className="size-4" strokeWidth={1.5} />,
    title: "Table",
    value: "TABLE",
  },
  {
    icon: <AlignStartHorizontalIcon className="size-4" strokeWidth={1.5} />,
    title: "Kanban",
    value: "KANBAN",
  },
  {
    icon: <CalendarIcon className="size-4" strokeWidth={1.5} />,
    title: "Calendar",
    value: "CALENDAR",
  },
];

type Props = {
  projectId?: string;
};

export default function TaskViewSwitcher({ projectId }: Props) {
  const [value, setValue] = useLocalStorage("active_tab", "TABLE");
  const [selectedRows, setSelectedRow] = useLocalStorage<
    Record<number, boolean>
  >("rows_selection", {});

  const { workspaceId } = useWorkspace();
  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);

  const { tasks, loading } = useTask();

  const rowsIds = useMemo(() => {
    if (!currentMember) return [];
    const rowsIds = Object.keys(selectedRows);
    return rowsIds;
  }, [selectedRows, currentMember]);

  const onValueChanged = (value: string) => {
    setValue(value);
  };

  return (
    <Tabs onValueChange={onValueChanged} value={value ?? "TABLE"}>
      <div className="w-full flex py-2 items-center rounded-sm bg-shark-800/50 px-3">
        <div className="flex-1">
          <TabsList className="h-fit bg-transparent">
            {TABS.map(e => (
              <TabsTrigger
                className={
                  "data-[state=active]:bg-shark-900 px-4 py-2 text-sm relative flex items-center gap-1"
                }
                value={e.value}
                key={e.value}
              >
                <div>{e.icon}</div>
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
      <div className="mt-3 w-full flex items-center gap-4">
        <TaskDataFilter projectId={projectId} />
        {!!Object.entries(selectedRows).length && (
          <DeleteTaskModal
            taskIds={rowsIds}
            onCallback={() => setSelectedRow({})}
          >
            <div
              className={buttonVariants({
                className: "rounded-md h-9",
                variant: "destructive",
                size: "icon",
              })}
            >
              <TrashIcon className="size-5" />
            </div>
          </DeleteTaskModal>
        )}
      </div>
      {!!loading && (
        <div className="w-full py-5 h-[150px] flex items-center justify-center">
          <LoaderIcon />
        </div>
      )}
      <div className="py-2" />
      {!loading && (
        <>
          <TabsContent value="TABLE" className="w-full">
            <TaskTable tasks={tasks} />
          </TabsContent>
          <TabsContent value="KANBAN">
            <TaskKanban tasks={tasks} />
          </TabsContent>
          <TabsContent value="CALENDAR">Calendar view</TabsContent>
        </>
      )}
    </Tabs>
  );
}
