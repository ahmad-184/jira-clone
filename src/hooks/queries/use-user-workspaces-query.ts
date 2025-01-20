import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useUserWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await client.api.workspace["user-workspaces"].$get();
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response.workspaces.map(workspace => ({
        ...workspace,
        createdAt: new Date(workspace.createdAt),
      }));
    },
  });
};
