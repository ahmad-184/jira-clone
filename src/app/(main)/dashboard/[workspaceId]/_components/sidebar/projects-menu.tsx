import CustomTooltip from "@/components/custom/tooltip";
import CreateProjectModal from "@/components/project/create-project-modal";
import ProjectIcon from "@/components/project/project-icon";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Member } from "@/db/schema";
import { useGetWorkspaceProjectsQuery } from "@/hooks/queries/use-get-workspace-projects";
import { usePermission } from "@/hooks/use-permission";
import { PlusIconFill } from "@/icons/plus-icon";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type Props = {
  currentMember: Member;
};

export default function ProjectsMenu({ currentMember }: Props) {
  const params = useParams<{ workspaceId: string }>();

  const { data, isPending, isFetched } = useGetWorkspaceProjectsQuery(
    params.workspaceId,
  );

  const canCreateProject = usePermission(
    currentMember.role,
    "projects",
    "create",
    undefined,
  );

  const { setOpenMobile } = useSidebar();

  const pathname = usePathname();

  const thereIsProjects = Boolean(
    !isPending && !!isFetched && data?.projects?.length,
  );

  const noProjects = Boolean(
    !isPending && !!isFetched && !data?.projects?.length,
  );

  const isFetchingProjects = Boolean(!!isPending && !isFetched);

  return (
    <div>
      <div className="w-full flex items-center justify-between">
        <SidebarGroupLabel className="!text-xs select-none text-uppercase text-muted-foreground px-0 !font-normal">
          Projects
        </SidebarGroupLabel>
        {!!canCreateProject.permission && (
          <CreateProjectModal>
            <div>
              <CustomTooltip content={"Create New Project"}>
                <PlusIconFill className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </CustomTooltip>
            </div>
          </CreateProjectModal>
        )}
      </div>
      <SidebarMenu className="gap-1">
        {isFetchingProjects && (
          <div className="flex flex-col gap-2">
            <Skeleton className="rounded-lg h-7 w-full" />
            <Skeleton className="rounded-lg h-7 w-full" />
          </div>
        )}
        {noProjects && (
          <div className="w-full text-xs mt-6  text-center text-muted-foreground dark:text-gray-500">
            - No projects -
          </div>
        )}
        {thereIsProjects &&
          data?.projects?.map(project => {
            const href = `/dashboard/${params.workspaceId}/project/${project.id}`;

            return (
              <SidebarMenuItem key={project.id}>
                <Link href={href} onClick={() => setOpenMobile(false)}>
                  <SidebarMenuButton
                    asChild
                    className="h-9 rounded-lg"
                    isActive={href === pathname}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div>
                        <ProjectIcon project={project} />
                      </div>
                      <p className="truncate flex-1">{project.name}</p>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
      </SidebarMenu>
    </div>
  );
}
