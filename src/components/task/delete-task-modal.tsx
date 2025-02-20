"use client";

import { useState } from "react";
import { DottedSeparator } from "../ui/dotted-separator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { LoaderButton } from "../loader-button";
import { useDeleteTask } from "./hooks/use-delete-task";
import { useWorkspace } from "@/hooks/workspace-provider";

type Props = {
  children: React.ReactNode;
  taskIds: string[];
  onCallback?: () => void;
};

export default function DeleteTaskModal({
  children,
  taskIds,
  onCallback,
}: Props) {
  const [open, setOpen] = useState(false);

  const { workspaceId } = useWorkspace();

  const onClose = () => setOpen(false);

  const { error, loading, onSubmit } = useDeleteTask({
    taskIds,
    workspaceId,
    onCallback: () => {
      onClose();
      onCallback?.();
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div onClick={() => setOpen(true)} className="w-fit">
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <DottedSeparator />
        {!!error && <p className="text-red-600 text-sm py-1"></p>}
        <div className="w-full flex items-center gap-3 justify-end">
          <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
          <LoaderButton
            className="flex-1"
            variant={"destructive"}
            onClick={onSubmit}
            isLoading={loading}
          >
            Delete
          </LoaderButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
