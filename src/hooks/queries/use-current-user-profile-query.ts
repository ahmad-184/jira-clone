import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";

export const useCurrentUserProfileQuery = () => {
  return useQuery({
    queryKey: ["current-user-profile"],
    queryFn: async () => {
      const res = await client.api.user["current-user-profile"].$get();
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response.profile ? convertToDate(response.profile) : undefined;
    },
  });
};
