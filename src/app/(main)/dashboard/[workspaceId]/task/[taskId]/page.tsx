import TaskDetails from "./_components/task-details";
import { hasPermission } from "@/lib/permission-system";
import { makeQueryClient } from "@/lib/react-query";
import { getCurrentUser } from "@/lib/session";
import { getMemberUseCase } from "@/use-cases/members";
import { getTaskUseCase } from "@/use-cases/tasks";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ workspaceId: string; taskId: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  const queryClient = makeQueryClient();

  const { workspaceId, taskId } = await params;

  const isMember = await getMemberUseCase(user.id, workspaceId);

  if (!isMember?.id) return redirect("/dashboard");

  const task = await getTaskUseCase(taskId);

  if (!task) return redirect(`/dashboard/${workspaceId}`);

  const canViewTask = hasPermission(isMember.role, "tasks", "view", {
    member: isMember,
    task,
  });

  if (!canViewTask.permission) return redirect(`/dashboard/${workspaceId}`);

  await queryClient.prefetchQuery({
    queryKey: ["task", workspaceId, taskId],
    queryFn: () => task,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="w-full">
        <TaskDetails taskId={task.id} />
      </div>
    </HydrationBoundary>
  );
}
