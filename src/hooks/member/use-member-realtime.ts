import {
  RealtimeChannel,
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { validate } from "uuid";
import { toast } from "sonner";

import { Member } from "@/db/schema";
import { supabase } from "@/lib/supabase";
import { useUserWorkspacesQuery } from "../queries/use-user-workspaces-query";
import useInternetConnection from "../use-connection";
import { useWorkspace } from "../workspace-provider";
import { useGetCurrentMemberQuery } from "../queries/use-get-current-member";
import { GetWorkspaceMembersProfileUseCaseReturnType } from "@/use-cases/types";

type DeletePayloadType = RealtimePostgresDeletePayload<{
  id: string;
}>;
type UpdatePayloadType = RealtimePostgresUpdatePayload<Member>;
type InsertPayloadType = RealtimePostgresInsertPayload<Member>;

// Members changes will show up in realtime for all users
export const useMemberRealtime = () => {
  const queryClient = useQueryClient();

  const { workspaceId } = useWorkspace();

  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: workspaces } = useUserWorkspacesQuery();
  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);

  const connection = useInternetConnection();

  const onDelete = async (payload: DeletePayloadType) => {
    if (!payload.old.id) return;
    if (!workspaces?.length || !currentMember) return;

    if (payload.old.id === currentMember.id) {
      queryClient.removeQueries({
        queryKey: ["current-member", workspaceId],
      });

      toast.error(
        "You are removed from this workspace, You will redirect to another workspace.",
      );

      if (timeOutRef.current) clearTimeout(timeOutRef.current);

      timeOutRef.current = setTimeout(
        () => (window.location.href = "/dashboard"),
        3000,
      );

      return;
    }

    const members = (await queryClient.getQueryData([
      "workspace-members",
      workspaceId,
    ])) as GetWorkspaceMembersProfileUseCaseReturnType;

    if (!members?.length) return;

    const memberToUpdate = members.find(e => e.id === payload.old.id);

    if (memberToUpdate) {
      await queryClient.invalidateQueries({
        queryKey: ["workspace-members", workspaceId],
      });
    }
  };

  const onUpdate = async (payload: UpdatePayloadType) => {
    if (!payload.new.id) return;
    if (!workspaces?.length || !currentMember) return;

    if (payload.new.id === currentMember?.id) {
      await queryClient.invalidateQueries({
        queryKey: ["current-member", workspaceId],
      });
    }

    const members = (await queryClient.getQueryData([
      "workspace-members",
      workspaceId,
    ])) as GetWorkspaceMembersProfileUseCaseReturnType;

    if (!members?.length) return;

    const memberToUpdate = members.find(e => e.id === payload.new.id);

    if (memberToUpdate) {
      await queryClient.invalidateQueries({
        queryKey: ["workspace-members", workspaceId],
      });
    }
  };

  const onInsert = async (payload: InsertPayloadType) => {
    if (!payload.new.id) return;
    if (!workspaces?.length || !currentMember) return;

    if (payload.new.workspaceId === workspaceId) {
      await queryClient.invalidateQueries({
        queryKey: ["workspace-members", workspaceId],
      });
    }
  };

  useEffect(() => {
    if (!connection) return;
    if (!workspaceId || !validate(workspaceId)) return;
    if (!currentMember?.id) return;

    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel("member_table")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gf_member" },
        payload => {
          if (payload.eventType === "INSERT")
            return onInsert(payload as InsertPayloadType);
          if (payload.eventType === "UPDATE")
            return onUpdate(payload as UpdatePayloadType);
          if (payload.eventType === "DELETE")
            return onDelete(payload as DeletePayloadType);
        },
      )
      .subscribe();

    return () => {
      channel?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, connection, currentMember]);

  return {};
};
