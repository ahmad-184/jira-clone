import { memberRoleEnum, Workspace } from "@/db/schema";

type UserRole = (typeof memberRoleEnum.enumValues)[number];
interface User {
  id: string;
  role: UserRole;
}
type Resource = { type: "workspace"; data: Workspace } | undefined;
export type Action = "create" | "read" | "update" | "delete";

export class AccessControl {
  static canAccess(user: User, action: Action, resource?: Resource): boolean {
    if (!user) return false;

    if (!resource?.type) return false;

    switch (resource?.type) {
      case "workspace":
        return workspaceAccessControl(user, action, resource.data);
      default:
        return false;
    }
  }

  static assertCanAccess(
    user: User,
    action: Action,
    resource?: Resource,
  ): void {
    if (!this.canAccess(user, action, resource)) {
      throw new Error(
        `Access denied: User does not have permission to ${action} this resource`,
      );
    }
  }
}

type WorkspaceAction = "create" | "read" | "update" | "delete";
function workspaceAccessControl(
  user: User,
  action: WorkspaceAction,
  workspace: Workspace,
): boolean {
  console.log(workspace);
  switch (user.role) {
    case "ADMIN":
      return true;
    case "MEMBER":
      switch (action) {
        case "read":
          return true;
        case "update":
          return false;
        case "delete":
          return false;
        default:
          return false;
      }
  }
}

// Helper functions for common checks
export const accessControl = {
  canCreate: (user: User) => AccessControl.canAccess(user, "create"),
  canRead: (user: User, resource?: Resource) =>
    AccessControl.canAccess(user, "read", resource),
  canUpdate: (user: User, resource?: Resource) =>
    AccessControl.canAccess(user, "update", resource),
  canDelete: (user: User, resource?: Resource) =>
    AccessControl.canAccess(user, "delete", resource),

  assertCanCreate: (user: User) =>
    AccessControl.assertCanAccess(user, "create"),
  assertCanRead: (user: User, resource?: Resource) =>
    AccessControl.assertCanAccess(user, "read", resource),
  assertCanUpdate: (user: User, resource?: Resource) =>
    AccessControl.assertCanAccess(user, "update", resource),
  assertCanDelete: (user: User, resource?: Resource) =>
    AccessControl.assertCanAccess(user, "delete", resource),
};
