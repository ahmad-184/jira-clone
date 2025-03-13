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
import DeleteTaskForm from "../forms/delete-task-form";

type Props = {
  children: React.ReactNode;
  taskIds: string[];
  onCallback?: () => void;
  className?: string;
};

export default function DeleteTaskModal({
  children,
  taskIds,
  onCallback,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const onClose = () => setOpen(false);

  const callback = () => {
    onClose();
    onCallback?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={className} onClick={() => setOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <DottedSeparator />
        <div className="w-full flex items-center gap-3 justify-end">
          <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
          <DeleteTaskForm taskIds={taskIds} onCallback={callback} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
