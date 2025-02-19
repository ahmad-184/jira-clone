import { HomeIcon, HomeIconFill } from "@/icons/home-icon";
import { SettingIcon, SettingIconFill } from "@/icons/setting-icon";
import { UsersIcon, UsersIconFill } from "@/icons/users-icon";
import {
  ViewColumnsIcon,
  ViewColumnsIconFill,
} from "@/icons/view-columns-icon";

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
      active_icon: <HomeIconFill fill="#93c5fd" />,
      href: `/dashboard/${workspaceId}`,
    },
    {
      id: "board",
      label: "Board",
      icon: <ViewColumnsIcon />,
      active_icon: <ViewColumnsIconFill fill="#93c5fd" />,
      href: `/dashboard/${workspaceId}/board`,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingIcon />,
      active_icon: <SettingIconFill fill="#93c5fd" />,
      href: `/dashboard/${workspaceId}/settings`,
    },
    {
      id: "members",
      label: "Members",
      icon: <UsersIcon />,
      active_icon: <UsersIconFill fill="#93c5fd" />,
      href: `/dashboard/${workspaceId}/members`,
    },
  ];
};
