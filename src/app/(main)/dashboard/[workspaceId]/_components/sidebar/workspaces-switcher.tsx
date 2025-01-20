import CustomTooltip from "@/components/custom/tooltip";
import CreateWorkspaceForm from "@/components/forms/create-workspace-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Workspace } from "@/db/schema";
import { PlusIconFill } from "@/icons/plus-icon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  workspaces: Workspace[] | undefined;
  defaultWorkspaceId: string;
  isFetching: boolean;
  user: User | undefined;
};

export default function WorkspacesSwitcher({
  workspaces,
  defaultWorkspaceId,
  isFetching,
  user,
}: Props) {
  const [selectedVersion, setSelectedVersion] = useState<string>(
    defaultWorkspaceId ?? "",
  );

  useEffect(() => {
    setSelectedVersion(defaultWorkspaceId);
  }, [defaultWorkspaceId]);

  const router = useRouter();

  const handleSelect = (value: string) => {
    setSelectedVersion(value);
    router.push(`/dashboard/${value}`);
  };

  return (
    <Dialog>
      <SidebarMenu className="gap-2">
        <SidebarMenuItem className="justify-between flex !flex-row gap-3">
          <p className="text-xs select-none text-uppercase text-muted-foreground">
            Workspaces
          </p>
        </SidebarMenuItem>
        <SidebarMenuItem>
          {!isFetching && (
            <Select value={selectedVersion} onValueChange={handleSelect}>
              <SelectTrigger className="px-1 !shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="mb-4">
                  <SelectLabel className="text-xs">Workspaces list</SelectLabel>
                  {workspaces?.map(workspace => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      <div className="flex items-center flex-row gap-2">
                        {!!workspace.imageUrl ? (
                          <div className="w-9 h-9 relative rounded-lg overflow-hidden">
                            <Image
                              alt={workspace.name}
                              src={workspace.imageUrl}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-blue-500 overflow-hidden flex items-center justify-center">
                            <p className="text-sm uppercase font-semibold dark:text-black">
                              {workspace.name.charAt(0)}
                            </p>
                          </div>
                        )}
                        <p>{workspace.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <DialogTrigger asChild>
                    <div className="flex cursor-pointer hover:text-primary group items-center bg-muted/60 gap-2 hover:bg-muted px-2 py-2 rounded-lg text-xs text-muted-foreground">
                      <CustomTooltip content={"Create New Workspace"}>
                        <PlusIconFill className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </CustomTooltip>
                      <p>Create New Workspace</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Workspace</DialogTitle>
                      <DialogDescription>
                        Create a new workspace to start collaborating with your
                        team.
                      </DialogDescription>
                    </DialogHeader>
                    {!!user?.id && (
                      <CreateWorkspaceForm
                        userId={user.id}
                        isFirstWorkspace={false}
                      />
                    )}
                  </DialogContent>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {!!isFetching && <Skeleton className="w-full h-12 rounded-xl" />}
        </SidebarMenuItem>
      </SidebarMenu>
    </Dialog>
  );
}
