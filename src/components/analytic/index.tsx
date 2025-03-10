import { ProjectAnalyticsResponse } from "@/hooks/queries/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import AnalyticCard from "./analytic-card";
import { DottedSeparator } from "../ui/dotted-separator";

type Props = ProjectAnalyticsResponse;

export default function Analytic({ analytics }: Props) {
  return (
    <div className="w-full">
      <ScrollArea className="w-full rounded-md border whitespace-nowrap shrink-0">
        <div className="w-full flex flex-row gap-1 bg-background">
          <div className="flex items-center flex-1">
            <AnalyticCard
              value={analytics.tasksCount}
              variant={analytics.tasksDifference > 0 ? "UP" : "DOWN"}
              difference={analytics.tasksDifference}
              color={analytics.tasksDifference > 0 ? "GREEN" : "RED"}
              title="Total tasks"
            />
            <DottedSeparator direction="vertical" className="h-full" />
          </div>
          <div className="flex items-center flex-1">
            <AnalyticCard
              value={analytics.assignedTasksCount}
              variant={analytics.assignedTasksDifference > 0 ? "UP" : "DOWN"}
              difference={analytics.assignedTasksDifference}
              color={analytics.assignedTasksDifference > 0 ? "GREEN" : "RED"}
              title="Assigned tasks"
            />
            <DottedSeparator className="h-full" direction="vertical" />
          </div>
          <div className="flex items-center flex-1">
            <AnalyticCard
              value={analytics.completedTasksCount}
              variant={analytics.completedTasksDifference > 0 ? "UP" : "DOWN"}
              difference={analytics.completedTasksDifference}
              color={analytics.completedTasksDifference > 0 ? "GREEN" : "RED"}
              title="Completed tasks"
            />
            <DottedSeparator className="h-full" direction="vertical" />
          </div>
          <div className="flex items-center flex-1">
            <AnalyticCard
              value={analytics.incompletedTasksCount}
              variant={analytics.incompletedTasksDifference > 0 ? "UP" : "DOWN"}
              difference={analytics.incompletedTasksDifference}
              color={analytics.incompletedTasksDifference > 0 ? "RED" : "GREEN"}
              title="Incompleted tasks"
            />
            <DottedSeparator className="h-full" direction="vertical" />
          </div>
          <div className="flex items-center flex-1">
            <AnalyticCard
              value={analytics.overdueTasksCount}
              variant={analytics.overdueTasksDifference > 0 ? "UP" : "DOWN"}
              difference={analytics.overdueTasksDifference}
              color={analytics.overdueTasksDifference > 0 ? "RED" : "GREEN"}
              title="Overdue tasks"
            />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
