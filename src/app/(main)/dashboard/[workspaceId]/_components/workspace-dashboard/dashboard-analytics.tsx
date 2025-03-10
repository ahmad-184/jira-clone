import Analytic from "@/components/analytic";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkspaceAnalyticsQuery } from "@/hooks/queries/use-get-workspace-analytics ";
import { useWorkspace } from "@/hooks/workspace-provider";

export default function DashboardAnalytics() {
  const { workspaceId } = useWorkspace();

  const { data, isPending } = useGetWorkspaceAnalyticsQuery(workspaceId);

  if (isPending) return <Skeleton className="w-full h-[150px]" />;

  if (!data) return null;

  return (
    <div>
      <Analytic analytics={data} />
    </div>
  );
}
