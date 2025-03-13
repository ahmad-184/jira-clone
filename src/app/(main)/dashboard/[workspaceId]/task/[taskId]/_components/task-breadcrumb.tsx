import Link from "next/link";

import ProjectIcon from "@/components/project/project-icon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useWorkspace } from "@/hooks/workspace-provider";
import { GetTaskUseCaseReturn } from "@/use-cases/types";

type Props = {
  task: GetTaskUseCaseReturn;
};

export default function TaskBreadcrumb({ task }: Props) {
  const { workspaceId } = useWorkspace();

  return (
    <div className="w-full flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              className="text-base font-medium flex items-center gap-2 hover:text-primary"
              href={`/dashboard/${workspaceId}/project/${task.project.id}`}
            >
              <div>
                <ProjectIcon project={task.project} className="size-5" />
              </div>
              <p>{task.project.name}</p>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base font-medium">
              {task.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
