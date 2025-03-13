"use client";

import { useMemo } from "react";

import { Role } from "@/db/schema";
import { hasPermission, Permissions } from "@/lib/permission-system/";

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
