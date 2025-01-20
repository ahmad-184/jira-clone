import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import CreateFirstWorkspace from "./_components/create-first-workspace";
import { findUserFirstWorkspaceMembershipUseCase } from "@/use-cases/members";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  const membership = await findUserFirstWorkspaceMembershipUseCase(user.id);

  if (membership?.id) return redirect(`/dashboard/${membership.workspaceId}`);

  return <CreateFirstWorkspace user={user} />;
}
