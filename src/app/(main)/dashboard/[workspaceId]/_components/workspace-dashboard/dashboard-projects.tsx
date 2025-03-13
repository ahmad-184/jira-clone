import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetWorkspaceProjectsQuery } from "@/hooks/queries/use-get-workspace-projects";
import { useWorkspace } from "@/hooks/workspace-provider";
import CreateProjectModal from "@/components/modals/create-project-modal";
import { buttonVariants } from "@/components/ui/button";
import ProjectIcon from "@/components/project/project-icon";

export default function DashboardProjects() {
  const { workspaceId } = useWorkspace();
  const { data, isPending } = useGetWorkspaceProjectsQuery(workspaceId);

  if (isPending) return <Skeleton className="w-full h-[300px]" />;

  if (!data) return null;

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex w-full gap-5 justify-between items-center mb-3">
            <CardTitle className="text-muted-foreground font-medium">
              Projects ({data.projects?.length || 0})
            </CardTitle>
            <div>
              <CreateProjectModal>
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
              </CreateProjectModal>
            </div>
          </div>
          <DottedSeparator />
        </CardHeader>
        <CardContent>
          <div className="flex flex-row flex-wrap gap-3">
            {data.projects?.map(project => (
              <Link
                className="w-full lg:w-[48.5%] rounded-md bg-shark-900 p-3 px-4 hover:bg-shark-800 transition-colors duration-200"
                key={project.id}
                href={`/dashboard/${workspaceId}/project/${project.id}`}
              >
                <div className="w-full flex items-center gap-2">
                  <ProjectIcon className="w-10 h-10" project={project} />
                  <h3 className="text-base font-medium truncate">
                    {project.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
