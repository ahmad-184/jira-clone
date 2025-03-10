"use client";

import ProjectDetails from "./project-details";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import TaskView from "@/components/task";
import ProjectAnalytics from "./project-analytics";

type Props = {
  projectId: string;
};

// view project details and tasks.
export default function ProjectView({ projectId }: Props) {
  return (
    <div className="w-full flex flex-col gap-7">
      <ProjectDetails projectId={projectId} />
      <ProjectAnalytics projectId={projectId} />
      <DottedSeparator />
      <TaskView />
    </div>
  );
}
