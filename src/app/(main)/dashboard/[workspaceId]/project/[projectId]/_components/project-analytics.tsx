"use client";

import Analytic from "@/components/analytic";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectAnalyticsQuery } from "@/hooks/queries/use-get-project-analytics";

type Props = {
  projectId: string;
};

export default function ProjectAnalytics({ projectId }: Props) {
  const { data, isPending } = useGetProjectAnalyticsQuery(projectId);

  if (isPending) return <Skeleton className="w-full h-[150px]" />;
  if (!data) return null;

  return <Analytic analytics={data} />;
}
