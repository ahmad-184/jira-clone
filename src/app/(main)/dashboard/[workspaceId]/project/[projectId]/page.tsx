import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import ProjectView from "./_components/project-view";

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
        <h1 className="text-3xl font-bold mb-1">Project</h1>
        <p className="text-sm text-muted-foreground">
          Manage your project tasks throgh table, kanban and calender here.
        </p>
      </div>
      <ProjectView projectId={projectId} />
    </div>
  );
}
