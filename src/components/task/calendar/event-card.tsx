import Avatar from "@/components/avatar";
import ProjectIcon from "@/components/project/project-icon";
import { useWorkspace } from "@/hooks/workspace-provider";
import { cn } from "@/lib/utils";
import { GetTaskUseCaseReturn } from "@/use-cases/types";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  id: GetTaskUseCaseReturn["id"];
  title: GetTaskUseCaseReturn["name"];
  project: GetTaskUseCaseReturn["project"];
  assignee: GetTaskUseCaseReturn["assignedTo"];
  status: GetTaskUseCaseReturn["status"];
};

export default function EventCard({
  id,
  title,
  project,
  assignee,
  status,
}: Props) {
  const { workspaceId } = useWorkspace();
  const color = useMemo(() => {
    if (status === "BACKLOG") return "border-l-pink-400";
    if (status === "TODO") return "border-l-red-400";
    if (status === "IN_PROGRESS") return "border-l-yellow-400";
    if (status === "IN_REVIEW") return "border-l-blue-400";
    if (status === "DONE") return "border-l-emerald-400";
    return "border-primary";
  }, [status]);

  return (
    <Link href={`/dashboard/${workspaceId}/task/${id}`}>
      <div className="px-1.5 py-1">
        <div
          className={cn("rounded-md border p-2 bg-shark-900 border-l-4", color)}
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-shark-50 truncate">
              {title}
            </p>
            <div className="flex items-center gap-1.5">
              <Avatar
                className="size-6"
                profile={assignee.user.profile}
                alt={assignee.user.profile.displayName ?? ""}
              />
              <div className="p-[2.5px] rounded-full bg-shark-700" />
              <ProjectIcon project={project} className="size-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
