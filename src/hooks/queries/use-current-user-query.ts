import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await client.api.user["current-user"].$get();
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return {
        user: response.user
          ? {
              ...response.user,
              createdAt: new Date(response.user?.createdAt ?? Date.now()),
              emailVerified: response.user?.emailVerified
                ? new Date(response.user?.emailVerified ?? Date.now())
                : null,
            }
          : undefined,
      };
    },
  });
};
