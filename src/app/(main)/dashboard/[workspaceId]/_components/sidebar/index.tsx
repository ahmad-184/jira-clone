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
import { useParams, usePathname } from "next/navigation";
import WorkspacesSwitcher from "./workspaces-switcher";
import { SIDEBAR_OPTIONS } from "@/constants/sidebar";
import Link from "next/link";
import CustomTooltip from "@/components/custom/tooltip";
import { PlusIconFill } from "@/icons/plus-icon";

export function Sidebar() {
  const { data: workspaces, isPending } = useUserWorkspacesQuery();
  const { data: user } = useCurrentUserQuery();

  const { setOpenMobile } = useSidebar();

  const params = useParams<{ workspaceId: string }>();
  const pathname = usePathname();

  const options = SIDEBAR_OPTIONS(params.workspaceId);

  const currentPath = pathname.split(params.workspaceId)[1];

  const activePath =
    !currentPath || currentPath === "" || currentPath === null
      ? options[0]
      : options.find(item => currentPath.replace("/", "") === item.id);

  return (
    <AppSidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup>
          <WorkspacesSwitcher
            workspaces={workspaces}
            isFetching={isPending}
            defaultWorkspaceId={params.workspaceId ?? ""}
            user={user}
          />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="!text-xs select-none text-uppercase text-muted-foreground px-0 !font-normal">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {options.map(item => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} onClick={() => setOpenMobile(false)}>
                    <SidebarMenuButton
                      asChild
                      className="h-11 rounded-xl"
                      isActive={activePath?.id === item.id}
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {activePath?.id === item.id
                          ? item.active_icon
                          : item.icon}
                        {item.label}
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <div className="w-full flex items-center justify-between">
            <SidebarGroupLabel className="!text-xs select-none text-uppercase text-muted-foreground px-0 !font-normal">
              Projects
            </SidebarGroupLabel>
            <CustomTooltip content={"Create New Project"}>
              <PlusIconFill className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </CustomTooltip>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </AppSidebar>
  );
}
