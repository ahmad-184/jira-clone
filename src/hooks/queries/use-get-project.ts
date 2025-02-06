import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await client.api.project[":projectId"].$get({
        param: {
          projectId,
        },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response.project
        ? {
            ...response.project,
            createdAt: new Date(response.project.createdAt ?? Date.now()),
          }
        : undefined;
    },
    enabled: !!projectId,
  });
};
