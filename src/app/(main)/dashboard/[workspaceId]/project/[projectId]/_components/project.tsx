"use client";

import ProjectIcon from "@/components/project/project-icon";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectQuery } from "@/hooks/queries/use-get-project";
import { SettingIconFill } from "@/icons/setting-icon";
import { fDate } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  projectId: string;
};

export default function Project({ projectId }: Props) {
  const { data: project, isPending } = useGetProjectQuery(projectId);

  if (isPending) return <LoadingSkeleton />;
  if (!project) return null;

  return (
    <div className="w-full flex items-center gap-5 justify-between">
      <div className="flex items-center gap-4">
        <div>
          <ProjectIcon
            project={project}
            className="rounded-xl size-16 !text-xl"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <p className="text-sm text-muted-foreground">
            Create at {fDate(project.createdAt ?? new Date(Date.now()))}
          </p>
        </div>
      </div>
      <div>
        <Link
          href={`/dashboard/${project.workspaceId}/project/${project.id}/settings`}
          className={cn(
            buttonVariants({
              variant: "secondary",
            }),
          )}
        >
          <SettingIconFill />
          Ptoject Settings
        </Link>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full flex items-center gap-5 justify-between">
      <div className="flex items-center gap-4">
        <div>
          <Skeleton className="rounded-xl size-16" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="rounded-lg w-28 h-5" />
          <Skeleton className="rounded-md w-40 h-4" />
        </div>
      </div>
      <div>
        <Skeleton className="rounded-xl w-[160px] h-11" />
      </div>
    </div>
  );
}
