"use client";

import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarHeader from "./sidebar-header";
import { useUserWorkspacesQuery } from "@/hooks/queries/use-user-workspaces-query";
import { useCurrentUserQuery } from "@/hooks/queries/use-current-user-query";
import { usePathname } from "next/navigation";
import WorkspacesSwitcher from "./workspaces-switcher";
import { SIDEBAR_OPTIONS } from "@/constants/sidebar";
import Link from "next/link";
import { useWorkspaceRealtime } from "@/hooks/workspace/use-workspace-realtime";
import ProjectsMenu from "./projects-menu";
import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useProjectRealtime } from "@/hooks/project/use-project-realtime";
import { useWorkspace } from "@/hooks/workspace-provider";
import { cn } from "@/lib/utils";
import { useMemberRealtime } from "@/hooks/member/use-member-realtime";

export function Sidebar() {
  const { workspaceId } = useWorkspace();

  const { data: workspaces, isPending } = useUserWorkspacesQuery();
  const { data: user } = useCurrentUserQuery();
  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);

  useWorkspaceRealtime();
  useProjectRealtime();
  useMemberRealtime();

  const { setOpenMobile } = useSidebar();

  const pathname = usePathname();

  const options = SIDEBAR_OPTIONS(workspaceId);

  const currentPath = pathname.split(workspaceId)[1];

  const activePath =
    !currentPath || currentPath === "" || currentPath === null
      ? options[0]
      : options.find(item => currentPath.replace("/", "") === item.id);

  return (
    <AppSidebar className="dark:[&>div]:!bg-shark-900">
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup>
          <WorkspacesSwitcher
            workspaces={workspaces}
            isFetching={isPending}
            defaultWorkspaceId={workspaceId ?? ""}
            user={user}
          />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="!text-xs select-none text-uppercase text-muted-foreground px-0 !font-normal">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {options.map(item => {
                const isActive = Boolean(activePath?.id === item.id);

                return (
                  <SidebarMenuItem key={item.label}>
                    <Link href={item.href} onClick={() => setOpenMobile(false)}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "relative h-11 rounded-sm data-[active=true]:!bg-blue-900/70",
                        )}
                        isActive={isActive}
                      >
                        <div
                          className={cn(
                            "relative flex items-center gap-2 text-muted-foreground",
                          )}
                        >
                          {!!isActive && (
                            <div className="absolute left-0 top-1/2 rounded-e-xl -translate-y-[50%] bg-blue-500 w-1 h-[20px]" />
                          )}
                          <span
                            className={cn("ml-0 transition-all", {
                              "ml-1": !!isActive,
                            })}
                          >
                            {!!isActive ? item.active_icon : item.icon}
                          </span>
                          <span
                            className={cn({
                              "!text-blue-300": isActive,
                            })}
                          >
                            {item.label}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {!!currentMember && <ProjectsMenu currentMember={currentMember} />}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </AppSidebar>
  );
}
