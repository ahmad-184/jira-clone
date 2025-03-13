import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import JoinWorkspaceForm from "@/components/forms/join-worksoace-form";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { getMemberUseCase } from "@/use-cases/members";
import { getWorkspaceUseCase } from "@/use-cases/workspaces";

type Props = {
  params: Promise<{
    id: string;
    inviteCode: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id, inviteCode } = await params;

  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  const workspace = await getWorkspaceUseCase(id);

  if (!workspace) return notFound();

  if (String(workspace.inviteCode) !== String(inviteCode)) return notFound();

  const member = await getMemberUseCase(user.id, workspace.id);

  if (member)
    return (
      <div className="w-full text-center flex flex-col items-center justify-center gap-6">
        <p className="text-2xl font-semibold">
          You are already a member of this workspace
        </p>
        <Link
          href={`/dashboard`}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Back to dashboard
        </Link>
      </div>
    );

  return (
    <Card className="w-full md:max-w-lg bg-white dark:bg-shark-950/50">
      <CardHeader>
        <CardTitle className="text-xl">Join workspace</CardTitle>
        <CardDescription className="text-base">
          You are invited to join{" "}
          <span className="dark:text-shark-300 text-shark-800 font-semibold">
            {workspace.name}
          </span>{" "}
          workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <JoinWorkspaceForm inviteCode={inviteCode} workspaceId={workspace.id} />
      </CardContent>
    </Card>
  );
}
