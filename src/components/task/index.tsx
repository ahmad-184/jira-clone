"use client";

import { useParams } from "next/navigation";

import TaskViewSwitcher from "./task-view-switcher";

export default function TaskView() {
  const { projectId } = useParams<{ projectId: string | undefined }>();

  return (
    <div>
      <TaskViewSwitcher projectId={projectId || undefined} />
    </div>
  );
}
