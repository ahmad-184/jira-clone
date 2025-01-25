import { SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Sidebar } from "./_components/sidebar";
import Header from "./_components/header";
import { findUserFirstWorkspaceMembershipUseCase } from "@/use-cases/members";
import { getUserWorkspacesUseCase } from "@/use-cases/workspaces";
import { makeQueryClient } from "@/lib/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserProfileUseCase } from "@/use-cases/users";

export const revalidate = 60; // 1 minute

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const queryClient = makeQueryClient();

  const user = await getCurrentUser();

  const { workspaceId } = await params;

  if (!user) return redirect("/sign-in");

  const membership = await findUserFirstWorkspaceMembershipUseCase(user.id);

  if (!membership?.id) return redirect("/dashboard");

  const workspaces = await getUserWorkspacesUseCase(user.id);

  if (!workspaces.length) return redirect("/dashboard");

  if (!workspaces.find(e => e.id === workspaceId)) {
    await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    return redirect(`/dashboard/${workspaces[0].id}`);
  }

  await queryClient.prefetchQuery({
    queryKey: ["workspaces"],
    queryFn: () => workspaces,
  });

  await queryClient.prefetchQuery({
    queryKey: ["current-user"],
    queryFn: () => user,
  });

  await queryClient.prefetchQuery({
    queryKey: ["current-user-profile"],
    queryFn: () => getUserProfileUseCase(user.id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="min-w-screen min-h-screen">
        <SidebarProvider>
          <Sidebar />
          <main className="flex-1 flex p-4 flex-col gap-7 dark:bg-zinc-900/70">
            <Header />
            <div className="flex-1 pb-5">{children}</div>
          </main>
        </SidebarProvider>
      </main>
    </HydrationBoundary>
  );
}
