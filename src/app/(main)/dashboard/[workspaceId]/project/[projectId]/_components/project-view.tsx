"use client";

import TaskViewSwitcher from "@/components/task/task-view-switcher";
import ProjectDetails from "./project-details";
import { DottedSeparator } from "@/components/ui/dotted-separator";

type Props = {
  projectId: string;
};

// view project details and tasks.
export default function ProjectView({ projectId }: Props) {
  return (
    <div className="w-full flex flex-col gap-7">
      <ProjectDetails projectId={projectId} />
      <DottedSeparator />
      <TaskViewSwitcher projectId={projectId} />
    </div>
  );
}
