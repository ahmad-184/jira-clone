"use client";

import ProjectDetails from "./project-details";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import TaskView from "@/components/task";

type Props = {
  projectId: string;
};

// view project details and tasks.
export default function ProjectView({ projectId }: Props) {
  return (
    <div className="w-full flex flex-col gap-7">
      <ProjectDetails projectId={projectId} />
      <DottedSeparator />
      <TaskView />
    </div>
  );
}
