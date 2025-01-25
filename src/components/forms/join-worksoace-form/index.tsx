"use client";

import { Form } from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";
import { useJoinWorkspace } from "./hooks/use-join-workspace";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  inviteCode: string;
  workspaceId: string;
};

export default function JoinWorkspaceForm({ inviteCode, workspaceId }: Props) {
  const { form, onSubmit, loading } = useJoinWorkspace({
    inviteCode,
    workspaceId,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="w-full flex gap-3 justify-end">
          <Link
            href={`/dashboard`}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Back to dashboard
          </Link>
          <LoaderButton isLoading={loading} type="submit" variant="default">
            Join workspace
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
