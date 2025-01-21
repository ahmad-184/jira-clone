import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Workspace } from "@/db/schema";
import { WarningIconFill } from "@/icons/warning-icon";
import { cn } from "@/lib/utils";

type Props = {
  workspace: Workspace;
};

export default function DeleteWorkspace({ workspace }: Props) {
  return (
    <Dialog>
      <div className="w-full border border-red-800 bg-red-950/20 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <div>
            <div className="p-1 rounded-md bg-red-700">
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
            <DialogTrigger asChild>
              <div
                className={cn(
                  buttonVariants({
                    variant: "destructive",
                    className: "mt-3 w-fit cursor-pointer",
                  }),
                )}
              >
                Delete Workspace
              </div>
            </DialogTrigger>
          </div>
        </div>
      </div>
      <DialogContent className="max-w-md !px-0 bg-neutral-900">
        <div className="w-full">
          <div className="px-5">
            <h1 className="text-lg font-medium">
              Confirm deletion of {workspace.name}
            </h1>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
