import { useMemo } from "react";

import { statusNames } from "@/constants/status";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/db/schema";

export default function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const statusBg = useMemo(() => {
    if (status === "BACKLOG")
      return "bg-gradient-to-t from-pink-400 to-pink-300 hover:from-pink-500 hover:to-pink-400";
    if (status === "TODO")
      return "bg-gradient-to-t from-red-400 to-red-300 hover:from-red-500 hover:to-red-400";
    if (status === "IN_PROGRESS")
      return "bg-gradient-to-t from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400";
    if (status === "IN_REVIEW")
      return "bg-gradient-to-t from-blue-400 to-blue-300 hover:from-blue-500 hover:to-blue-400";
    if (status === "DONE")
      return "bg-gradient-to-t from-emerald-400 to-emerald-300 hover:from-emerald-500 hover:to-emerald-400";
    return "bg-gradient-to-t bg-primary hover:bg-primary/80";
  }, [status]);

  return (
    <Badge className={cn("capitalize select-none rounded-lg", statusBg)}>
      {statusNames[status]}
    </Badge>
  );
}
