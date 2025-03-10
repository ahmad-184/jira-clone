import CreateTaskModal from "@/components/modals/create-task-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTasksQuery } from "@/hooks/queries/use-get-tasks";
import { useWorkspace } from "@/hooks/workspace-provider";
import { fToNow } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  memberId: string;
};

export default function DashboardAssignedTasks({ memberId }: Props) {
  const { workspaceId } = useWorkspace();
  const { data, isPending } = useGetTasksQuery({
    workspaceId,
    limit: 3,
    assignee: memberId,
  });

  if (isPending) return <Skeleton className="w-full h-[300px]" />;

  if (data === undefined) return null;

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex w-full gap-5 justify-between items-center mb-3">
            <CardTitle className="text-muted-foreground font-medium">
              Assinged Tasks ({data.total})
            </CardTitle>
            <div>
              <CreateTaskModal
                initialData={{
                  assignedToMemberId: memberId,
                }}
              >
                <div
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      size: "icon",
                      className: "cursor-pointer",
                    }),
                  )}
                >
                  <PlusIcon />
                </div>
              </CreateTaskModal>
            </div>
          </div>
          <DottedSeparator />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {data.tasks.map(task => (
            <Link
              key={task.id}
              href={`/dashboard/${workspaceId}/task/${task.id}`}
              className="w-full bg-shark-900 p-3 px-4 rounded-md hover:bg-shark-800 transition-colors duration-200"
            >
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg font-medium">{task.name}</h3>
                <div className="flex gap-2 items-center">
                  <p className="text-base text-muted-foreground truncate">
                    {task.project.name}
                  </p>
                  <div className="p-[2.4px] rounded-full bg-shark-700" />
                  <div className="flex gap-1 items-center text-muted-foreground truncate">
                    <CalendarIcon className="w-4 h-4" />
                    <p className="text-sm">{fToNow(task.createdAt)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <Link href={`/dashboard/${workspaceId}/board?assignee=${memberId}`}>
            <Button variant={"secondary"} className="w-full h-12">
              Show all
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
