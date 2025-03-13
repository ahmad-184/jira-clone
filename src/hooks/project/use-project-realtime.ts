import {
  RealtimeChannel,
  RealtimePostgresDeletePayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { validate } from "uuid";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { Project } from "@/db/schema";
import { supabase } from "@/lib/supabase";
import useInternetConnection from "../use-connection";
import { useWorkspace } from "../workspace-provider";
import { useGetWorkspaceProjectsQuery } from "../queries/use-get-workspace-projects";

type DeletePayloadType = RealtimePostgresDeletePayload<{
  id: string;
}>;
type UpdatePayloadType = RealtimePostgresUpdatePayload<Project>;

// project changes will show up in realtime for all users
export const useProjectRealtime = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { workspaceId } = useWorkspace();
  const params = useParams<{ projectId: string | undefined }>();

  const { data: projectsData } = useGetWorkspaceProjectsQuery(workspaceId);

  const connection = useInternetConnection();

  const onDelete = useCallback(
    async (payload: DeletePayloadType) => {
      if (!payload.old.id) return;

      if (params.projectId && payload.old.id === params.projectId) {
        toast("This project is deleted.");

        if (timeOutRef.current) clearTimeout(timeOutRef.current);

        timeOutRef.current = setTimeout(
          () => router.replace(`/dashboard/${workspaceId}`),
          2000,
        );
      }

      if (projectsData?.projects?.some(p => p.id === payload.old.id)) {
        await queryClient.invalidateQueries({
          queryKey: ["workspace-projects", workspaceId],
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectsData, params, workspaceId, queryClient],
  );

  const onUpdate = useCallback(
    async (payload: UpdatePayloadType) => {
      if (!payload.new.id) return;

      if (!!params.projectId && payload.new.id === params.projectId) {
        await queryClient.invalidateQueries({
          queryKey: ["project", params.projectId],
        });
      }

      if (projectsData?.projects?.some(p => p.id === payload.new.id)) {
        await queryClient.invalidateQueries({
          queryKey: ["workspace-projects", workspaceId],
        });
      }
    },
    [projectsData, params, workspaceId, queryClient],
  );

  useEffect(() => {
    if (!connection) return;
    if (!workspaceId || !validate(workspaceId)) return;

    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel("project_table")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gf_project" },
        payload => {
          if (payload.eventType === "DELETE")
            onDelete(payload as DeletePayloadType);
          if (payload.eventType === "UPDATE")
            onUpdate(payload as UpdatePayloadType);
        },
      )
      .subscribe();

    return () => {
      channel?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, connection, projectsData, params]);

  return {};
};
