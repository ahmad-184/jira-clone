"use client";

import { useState } from "react";

import { useWorkspace } from "@/hooks/workspace-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreateProjectForm from "../forms/create-project-form";
import { DottedSeparator } from "../ui/dotted-separator";

type Props = {
  children: React.ReactNode;
};

export default function CreateProjectModal({ children }: Props) {
  const [open, setOpen] = useState(false);
  const { workspaceId } = useWorkspace();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Project</DialogTitle>
          <DialogDescription>
            Create a new project to start tracking your time.
          </DialogDescription>
        </DialogHeader>
        <DottedSeparator />
        <CreateProjectForm workspaceId={workspaceId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
