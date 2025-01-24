import { Member, Workspace } from "@/db/schema";

type Role = "ADMIN" | "MEMBER";
type PermissionActor = Omit<Member, "createdAt" | "updatedAt">;

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: PermissionActor, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

type WorkspacePermission = {
  action: "view" | "create" | "update" | "delete";
  dataType: Workspace;
};

type Permissions = {
  workspaces: WorkspacePermission;
};

const ROLES = {
  ADMIN: {
    workspaces: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  MEMBER: {
    workspaces: {
      view: true,
      update: false,
      delete: false,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: PermissionActor,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  const permission = (ROLES as RolesWithPermissions)[user.role][resource]?.[
    action
  ];
  if (permission == null) return false;

  if (typeof permission === "boolean") return permission;
  return data != null && permission(user, data);
}
