import { CheckIcon, CheckIconFill } from "@/icons/check-icon";
import { HomeIcon, HomeIconFill } from "@/icons/home-icon";
import { SettingIcon, SettingIconFill } from "@/icons/setting-icon";
import { UsersIcon, UsersIconFill } from "@/icons/users-icon";

type SidebarOptionsType = {
  id: string;
  label: string;
  icon: React.ReactNode;
  active_icon: React.ReactNode;
  href: string;
}[];

export const SIDEBAR_OPTIONS = (workspaceId: string): SidebarOptionsType => {
  return [
    {
      id: "",
      label: "Dashboard",
      icon: <HomeIcon />,
      active_icon: <HomeIconFill />,
      href: `/dashboard/${workspaceId}`,
    },
    {
      id: "tasks",
      label: "My Tasks",
      icon: <CheckIcon />,
      active_icon: <CheckIconFill />,
      href: `/dashboard/${workspaceId}/tasks`,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingIcon />,
      active_icon: <SettingIconFill />,
      href: `/dashboard/${workspaceId}/settings`,
    },
    {
      id: "members",
      label: "Members",
      icon: <UsersIcon />,
      active_icon: <UsersIconFill />,
      href: `/dashboard/${workspaceId}/members`,
    },
  ];
};
