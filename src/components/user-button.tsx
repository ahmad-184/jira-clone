"use client";

import {
  LoaderIcon,
  LogOutIcon,
  MonitorCheckIcon,
  MoonIcon,
  PaletteIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCurrentUserProfileQuery } from "@/hooks/queries/use-current-user-profile-query ";
import Avatar from "./avatar";
import { useLogOutMutation } from "@/hooks/mutations/use-log-out-mutation";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";

export default function UserButton() {
  const {
    data: profile,
    isPending,
    isFetching,
    isFetched,
  } = useCurrentUserProfileQuery();

  const queryClient = useQueryClient();

  const { mutate: logOut } = useLogOutMutation({
    onSuccess: res => {
      if (res.success) {
        window.location.href = "/sign-in";
      }
    },
  });

  const onLogout = async () => {
    queryClient.removeQueries({ queryKey: ["workspaces"] });
    logOut({});
  };

  const { setTheme } = useTheme();

  if (isPending || isFetching)
    return (
      <div className="size-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      </div>
    );

  if (!profile || (isFetched && !profile)) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <Avatar profile={profile} alt="user profile" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={10}
        className="!p-0"
      >
        <div className="min-w-[250px]">
          <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-2">
            <Avatar profile={profile} alt="user profile" className="size-16" />
            <div className="flex flex-col items-center justify-center gap-">
              <p className="text-sm font-medium">{profile.displayName}</p>
              <p className="text-sm truncate max-w-[95%] text-muted-foreground">
                {profile.user?.email ?? "No email"}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="flex w-full flex-col py-1 pb-2 pt-2 gap-1">
            <DropdownMenuGroup className="px-2.5 !pb-1">
              <DropdownMenuItem>
                <SettingsIcon className="size-4" />
                <p>Settings</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onLogout}
                className="hover:!bg-destructive/20 dark:hover:!bg-destructive/40"
              >
                <LogOutIcon className="size-4" />
                <p>Log out</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="px-2.5">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <PaletteIcon className="size-4" />
                  <p>Theme</p>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <SunIcon className="size-4" /> Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <MoonIcon className="size-4" /> Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <MonitorCheckIcon className="size-4" /> System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
