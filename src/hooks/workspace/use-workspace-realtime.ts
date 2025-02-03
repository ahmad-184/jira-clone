import { Workspace } from "@/db/schema";
import { supabase } from "@/lib/supabase";
import {
  RealtimeChannel,
  RealtimePostgresDeletePayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { validate } from "uuid";
import { useUserWorkspacesQuery } from "../queries/use-user-workspaces-query";
import { toast } from "sonner";
import useInternetConnection from "../use-connection";

type DeletePayloadType = RealtimePostgresDeletePayload<{
  id: string;
}>;
type UpdatePayloadType = RealtimePostgresUpdatePayload<Workspace>;

// workspace changes will show up in realtime for all users
export const useWorkspaceRealtime = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const { data: workspaces } = useUserWorkspacesQuery();

  const connection = useInternetConnection();

  const onDelete = async (payload: DeletePayloadType) => {
    if (!payload.old.id) return;

    if (payload.old.id === workspaceId) {
      toast(
        "This workspace is deleted. You will redirect to another workspace.",
      );
      setTimeout(() => (window.location.href = "/dashboard"), 3000);

      return;
    }

    if (workspaces?.some(w => w.id === payload.old.id)) {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    }
  };

  const onpdate = async (payload: UpdatePayloadType) => {
    if (!payload.new.id) return;

    if (payload.new.id === workspaceId)
      await queryClient.invalidateQueries({
        queryKey: ["workspace", payload.new.id],
      });

    if (workspaces?.some(w => w.id === payload.old.id))
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
  };

  useEffect(() => {
    if (!connection) return;
    if (!workspaceId || !validate(workspaceId)) return;

    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel("workspaces_table")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gf_workspace" },
        payload => {
          if (payload.eventType === "DELETE")
            return onDelete(payload as DeletePayloadType);
          if (payload.eventType === "UPDATE")
            return onpdate(payload as UpdatePayloadType);
        },
      )
      .subscribe();

    return () => {
      channel?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, connection]);

  return {};
};
