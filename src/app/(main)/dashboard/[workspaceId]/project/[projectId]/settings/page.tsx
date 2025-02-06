import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import ProjectSettings from "./_components/project-settings";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  const { projectId } = await params;

  return (
    <div className="w-full h-full flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your project settings here.
        </p>
        <Separator className="mt-4" />
      </div>
      <ProjectSettings projectId={projectId} />
    </div>
  );
}
