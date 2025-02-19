import DeleteWorkspaceForm from "@/components/forms/delete-workspace-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Member, Workspace } from "@/db/schema";
import { usePermission } from "@/hooks/use-permission";
import { WarningIconFill } from "@/icons/warning-icon";
import { cn } from "@/lib/utils";

type Props = {
  workspace: Workspace;
  currentMember: Member;
};

export default function DeleteWorkspace({ workspace, currentMember }: Props) {
  const canDeleteWorkspace = usePermission(
    currentMember.role,
    "workspaces",
    "delete",
    undefined,
  );

  return (
    <Dialog>
      <div className="w-full border border-red-800 dark:bg-red-950/20 bg-red-400/10 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div>
            <div className="p-1 rounded-md dark:bg-red-700 bg-red-400">
              <WarningIconFill className="w-4 h-4 text-black" />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-base font-medium">
              Deleting this project will also remove your database.
            </h1>
            <p className="text-sm text-muted-foreground">
              Make sure you have made a backup if you want to keep your data.
            </p>
            {!canDeleteWorkspace.permission ? (
              <Button variant={"destructive"} className="mt-3 w-fit" disabled>
                Delete Workspace
              </Button>
            ) : (
              <DialogTrigger asChild>
                <div
                  className={cn(
                    buttonVariants({
                      variant: "destructive",
                      className: "mt-3 w-fit cursor-pointer",
                    }),
                    !canDeleteWorkspace.permission && "opacity-50 select-none",
                  )}
                >
                  Delete Workspace
                </div>
              </DialogTrigger>
            )}
          </div>
        </div>
      </div>
      <DialogContent className="max-w-md py-0 !px-0 dark:bg-shark-900 bg-shark-100">
        <div className="w-full pt-5 pb-4">
          <div className="px-5 pb-4">
            <DialogTitle className="text-lg font-medium">
              Confirm deletion of {workspace.name}
            </DialogTitle>
          </div>
          <div className="px-5 py-5 border-b border-t dark:border-shark-700 border-shark-400 bg-background">
            <div className="flex items-center gap-3">
              <WarningIconFill className="w-5 h-5 text-muted-foreground" />
              <DialogDescription className="text-muted-foreground text-sm">
                This will permanently delete the {workspace.name} project and
                all of its data.
              </DialogDescription>
            </div>
          </div>
          <div className="py-3 px-5">
            <DeleteWorkspaceForm
              workspaceName={workspace.name}
              workspaceId={workspace.id}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
