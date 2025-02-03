"use client";

import { Role } from "@/db/schema";
import { hasPermission, Permissions } from "@/lib/permission-system/";
import { useMemo } from "react";

export function usePermission<Resource extends keyof Permissions>(
  role: Role,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data: Permissions[Resource]["dataType"],
) {
  return useMemo(
    () => hasPermission(role, resource, action, data),
    [role, resource, action, data],
  );
}
