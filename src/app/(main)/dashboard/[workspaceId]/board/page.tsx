import TaskViewSwitcher from "@/components/task/task-view-switcher";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full h-full flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold mb-1">Board</h1>
        <p className="text-sm text-muted-foreground">
          View all your tasks in board page.
        </p>
      </div>
      <TaskViewSwitcher />
    </div>
  );
}
