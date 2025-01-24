"use client";

import ResetInviteCodeForm from "@/components/forms/reset-invite-code-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Workspace } from "@/db/schema";
import { env } from "@/env";
import { WarningIconFill } from "@/icons/warning-icon";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  workspace: Workspace;
};

export default function ResetInviteCode({ workspace }: Props) {
  const [open, setOpen] = useState(false);

  const inviteLink = `${env.NEXT_PUBLIC_HOST_URL}/workspaces/${workspace.id}/join/${workspace.inviteCode}`;

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full flex flex-col gap-5">
        <div>
          <h1 className="text-primary text-xl font-semibold">Invite Members</h1>
          <p className="text-muted-foreground text-sm">
            Use the invite link to add members to your workspace.
          </p>
        </div>
        <div className="w-full flex gap-2 items-center">
          <Input
            value={inviteLink}
            readOnly
            className="w-full !bg-zinc-50 dark:!bg-zinc-950/20"
          />
          <Button
            variant={"ghost"}
            className="!h-14 border"
            onClick={handleCopy}
          >
            <CopyIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-full flex justify-end">
          <DialogTrigger>
            <div
              className={buttonVariants({
                variant: "destructive",
                className: "h-9 text-sm",
              })}
            >
              Reset Invite Link
            </div>
          </DialogTrigger>
        </div>
      </div>
      <DialogContent className="max-w-md py-0 !px-0 dark:bg-neutral-900 bg-neutral-100">
        <div className="w-full pt-5 pb-4">
          <div className="px-5 pb-4">
            <DialogTitle className="text-lg font-medium">
              Reset Invite Link
            </DialogTitle>
          </div>
          <div className="px-5 py-5 border-b border-t dark:border-zinc-700 border-zinc-400 bg-background">
            <DialogDescription className="text-muted-foreground text-sm flex items-center gap-3">
              <WarningIconFill className="w-5 h-5" /> By doing this, current
              invite link will be invalidated.
            </DialogDescription>
          </div>
          <div className="px-5 pt-5">
            <ResetInviteCodeForm workspaceId={workspace.id} setOpen={setOpen} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
