import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";

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
      return response.user ? convertToDate(response.user) : undefined;
    },
  });
};
