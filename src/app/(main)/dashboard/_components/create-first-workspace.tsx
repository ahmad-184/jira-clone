"use client";

import CreateWorkspaceForm from "@/components/forms/create-workspace-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/db/schema";
import Logo from "@/icons/logo";

type Props = {
  user: User;
};

export default function CreateFirstWorkspace({ user }: Props) {
  return (
    <div className="w-full fixed h-screen md:px-5 overflow-auto dark:bg-zinc-900 bg-zinc-100">
      <div className="px-2 w-full h-full flex gap-3">
        <div className="my-auto flex items-center flex-col flex-1">
          <div className="py-10 w-full flex justify-center">
            <Card className="w-full md:w-2/3 bg-white dark:bg-zinc-950/50">
              <CardHeader className="mb-2">
                <div className="mb-2 w-full flex items-center">
                  <Logo />
                </div>
                <br />
                <CardTitle className="text-lg md:text-2xl">
                  Create workspace
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Get started by creating a workspace to organize your projects
                  <br />
                  and collaborate with your team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateWorkspaceForm userId={user.id} isFirstWorkspace={true} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
