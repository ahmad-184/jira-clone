import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";

export const useGetCurrentMemberQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["current-member", workspaceId],
    queryFn: async () => {
      const res = await client.api.member["current-member"].$get({
        query: { workspaceId },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response.member ? convertToDate(response.member) : undefined;
    },
    enabled: !!workspaceId,
  });
};
