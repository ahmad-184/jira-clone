"use client";
import { LoaderIcon, LogOutIcon } from "lucide-react";
import { useCurrentUserProfileQuery } from "@/hooks/queries/use-current-user-profile-query ";
import Avatar from "./avatar";
import { useLogOutMutation } from "@/hooks/mutations/use-log-out-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { SettingIconFill } from "@/icons/setting-icon";

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

  if (isPending || isFetching)
    return (
      <div className="size-10 rounded-full bg-shark-200 animate-pulse flex items-center justify-center">
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      </div>
    );

  if (!profile || (isFetched && !profile)) return null;

  return (
    <Popover modal={false}>
      <PopoverTrigger className="focus-visible:outline-none">
        <Avatar profile={profile} alt="user profile" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={10}
        className="!p-0 rounded-sm overflow-hidden"
      >
        <div className="min-w-[250px] bg-shark-800">
          <div className="flex flex-col p-3 items-center justify-center gap-2">
            <div className="w-full flex gap-2 items-center">
              <div>
                <Avatar
                  profile={profile}
                  alt="user profile"
                  className="size-16"
                />
              </div>
              <div className="flex flex-col gap-0 truncate">
                <p className="text-sm font-medium">{profile.displayName}</p>
                <p className="text-sm truncate max-w-[95%] text-shark-300">
                  {profile.user?.email ?? "No email"}
                </p>
              </div>
            </div>
          </div>
          <Separator className="bg-shark-600" />
          <div className="p-3">
            <div className="w-full flex flex-wrap gap-3">
              <Button
                variant={"secondary"}
                className="bg-shark-700 hover:bg-shark-700/80"
                size="sm"
              >
                <SettingIconFill />
                Settings
              </Button>
              <Button onClick={onLogout} variant={"destructive"} size="sm">
                <LogOutIcon />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
