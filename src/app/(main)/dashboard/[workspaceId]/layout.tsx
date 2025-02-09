import { SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Sidebar } from "./_components/sidebar";
import Header from "./_components/header";
import { getMemberUseCase } from "@/use-cases/members";
import { getUserWorkspacesUseCase } from "@/use-cases/workspaces";
import { makeQueryClient } from "@/lib/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getProfileWithUserEmailUseCase } from "@/use-cases/users";
import { WorkspaceProvider } from "@/providers/workspace-provider";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  const queryClient = makeQueryClient();

  const { workspaceId } = await params;

  const workspaces = await getUserWorkspacesUseCase(user.id);

  if (!workspaces.length) return redirect("/dashboard");

  const currentWorkspace = workspaces.find(e => e.id === workspaceId);

  if (!currentWorkspace) {
    await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    return redirect(`/dashboard/${workspaces[0].id}`);
  }

  const isMember = await getMemberUseCase(user.id, currentWorkspace.id);

  if (!isMember?.id) return redirect("/dashboard");

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["workspaces"],
      queryFn: () => workspaces,
    }),
    queryClient.prefetchQuery({
      queryKey: ["current-user"],
      queryFn: () => user,
    }),
    queryClient.prefetchQuery({
      queryKey: ["current-user-profile"],
      queryFn: () => getProfileWithUserEmailUseCase(user.id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["current-member", currentWorkspace.id],
      queryFn: () => isMember,
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <WorkspaceProvider workspaceId={currentWorkspace.id}>
        <main className="min-w-screen min-h-screen">
          <SidebarProvider>
            <Sidebar />
            <main className="flex-1 flex p-4 flex-col gap-7 dark:!bg-shark-900">
              <Header />
              <div className="flex-1 pb-5">{children}</div>
            </main>
          </SidebarProvider>
        </main>
      </WorkspaceProvider>
    </HydrationBoundary>
  );
}
