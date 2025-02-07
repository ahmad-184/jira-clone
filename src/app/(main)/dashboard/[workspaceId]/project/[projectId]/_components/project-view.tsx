"use client";

import ProjectDetails from "./project-details";

type Props = {
  projectId: string;
};

// view project details, tasks.
export default function ProjectView({ projectId }: Props) {
  return (
    <div className="w-full flex flex-col gap-10">
      <ProjectDetails projectId={projectId} />
    </div>
  );
}
