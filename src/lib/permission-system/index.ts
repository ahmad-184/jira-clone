import { Member, Role, Task, User } from "@/db/schema";

type PermissionResult = { permission: boolean; message?: string };

type PermissionCheck<Key extends keyof Permissions> =
  | PermissionResult
  | ((data: Permissions[Key]["dataType"]) => PermissionResult);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

type WorkspacePermission = {
  action: "view" | "update" | "delete";
  dataType?: undefined;
};

type MemberPermission = {
  action: "view" | "update" | "update.role" | "delete";
  dataType: { member: Member; user: User };
};

type ProjectPermission = {
  action: "create" | "view" | "update" | "delete";
  dataType: undefined;
};

type TaskPermission = {
  action: "create" | "view" | "update" | "delete";
  dataType: {
    task: Task & {
      createdBy: Member;
    };
    member: Member;
  };
};

export type Permissions = {
  workspaces: WorkspacePermission;
  members: MemberPermission;
  projects: ProjectPermission;
  tasks: TaskPermission;
};

const ROLES = {
  OWNER: {
    workspaces: {
      view: { permission: true },
      update: { permission: true },
      delete: { permission: true },
    },
    members: {
      view: { permission: true },
      update: { permission: true },
      ["update.role"]: ({ member, user }) => {
        // Owner can not change their role
        if (member.userId === user.id)
          return {
            permission: false,
            message: "Owner can not change their role.",
          };

        return {
          permission: true,
        };
      },
      delete: ({ user, member }) => {
        // Owner can not delete themselves
        if (user.id === member.userId)
          return {
            permission: false,
            message: "Owner can not delete themselves.",
          };

        return { permission: true };
      },
    },
    projects: {
      create: { permission: true },
      view: { permission: true },
      update: { permission: true },
      delete: { permission: true },
    },
    tasks: {
      create: { permission: true },
      view: { permission: true },
      update: { permission: true },
      delete: { permission: true },
    },
  },
  ADMIN: {
    workspaces: {
      view: { permission: true },
      update: { permission: true },
      delete: { permission: false },
    },
    members: {
      view: { permission: true },
      update: { permission: true },
      ["update.role"]: ({ member, user }) => {
        // Admins can not update owners role
        if (member.role === "OWNER")
          return {
            permission: false,
            message: "Admins can not update owner role",
          };

        // Admins can not update their own role
        if (member.role === "ADMIN" && user.id === member.userId)
          return {
            permission: false,
            message: "Admins can not update their own role",
          };

        // Admins can not update other admins role
        if (member.role === "ADMIN" && user.id !== member.userId)
          return {
            permission: false,
            message: "Admins can not update other admins role",
          };

        return { permission: true };
      },
      delete: ({ user, member }) => {
        // Admins can not delete owners
        if (member.role === "OWNER")
          return { permission: false, message: "Admins can not delete owners" };
        // Admins can not delete other admins, but can delete themselves
        if (member.role === "ADMIN" && member.userId !== user.id)
          return {
            permission: false,
            message: "Admins can not delete other admins",
          };
        // Admins can delete members
        // Admins can delete themselves
        return { permission: true };
      },
    },
    projects: {
      create: { permission: true },
      view: { permission: true },
      update: { permission: true },
      delete: { permission: true },
    },
    tasks: {
      create: { permission: true },
      view: { permission: true },
      update: ({ member, task }) => {
        // Allow if task is assigned to current member
        if (member.id === task.assignedToMemberId) return { permission: true };

        // Deny if task was created by owner or another admin
        if (
          task.createdBy.role === "OWNER" ||
          (task.createdBy.role === "ADMIN" &&
            task.createdBy.userId !== member.userId)
        ) {
          return { permission: false, message: "Access denied." };
        }

        // Allow if task was created by self or a member
        return { permission: true };
      },
      delete: ({ member, task }) => {
        // Allow if task is assigned to current member
        if (member.id === task.assignedToMemberId) return { permission: true };

        // Deny if task was created by owner or another admin
        if (
          task.createdBy.role === "OWNER" ||
          (task.createdBy.role === "ADMIN" &&
            task.createdBy.userId !== member.userId)
        ) {
          return { permission: false, message: "Access denied." };
        }

        // Allow if task was created by self or a member
        return { permission: true };
      },
    },
  },
  MEMBER: {
    workspaces: {
      view: { permission: true },
      update: { permission: false },
      delete: { permission: false },
    },
    members: {
      view: { permission: true },
      update: { permission: false },
      ["update.role"]: { permission: false },
      delete: ({ user, member }) => {
        // Members can not delete owners
        if (member.role === "OWNER")
          return {
            permission: false,
            message: "Members can not delete workspace owner.",
          };
        // Members can not delete admins
        if (member.role === "ADMIN")
          return {
            permission: false,
            message: "Members can not delete admins.",
          };
        // Members can not delete other members
        if (user.id !== member.userId && member.role === "MEMBER")
          return {
            permission: false,
            message: "Members can not delete other members.",
          };
        // Members can delete themselves
        return { permission: true };
      },
    },
    projects: {
      create: { permission: false },
      view: { permission: true },
      update: { permission: false },
      delete: { permission: false },
    },
    tasks: {
      create: { permission: true },
      view: { permission: true },
      update: ({ member, task }) => {
        // Members can update tasks that assigned to self.
        if (member.id === task.assignedToMemberId) return { permission: true };

        // Members can not update a task that created by Owner, Admins or another member.
        if (
          task.createdBy.role === "OWNER" ||
          task.createdBy.role === "ADMIN" ||
          (task.createdBy.role === "MEMBER" &&
            task.createdBy.userId !== member.userId)
        )
          return { permission: false, message: "Access denied." };

        // Members can update a task that created by self.
        return { permission: true };
      },
      delete: ({ member, task }) => {
        // Members can delete tasks that assigned to self.
        if (member.id === task.assignedToMemberId) return { permission: true };

        // Members can not delete a task that created by Owner, Admins or another member.
        if (
          task.createdBy.role === "OWNER" ||
          task.createdBy.role === "ADMIN" ||
          (task.createdBy.role === "MEMBER" &&
            task.createdBy.userId !== member.userId)
        )
          return { permission: false, message: "Access denied." };

        // Members can delete a task that created by self.
        return { permission: true };
      },
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  role: Role,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
): PermissionResult {
  const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action];

  if (permission == null)
    return { permission: false, message: "Permission not found" };

  if (typeof permission === "boolean") return permission;

  if (typeof permission === "function" && data != null) return permission(data);

  return permission as PermissionResult;
}
