import { database } from "@/db";

export type GetProfilePropsTypes = Parameters<
  typeof database.query.profiles.findFirst
>[0];

export type GetMemberPropsType = Parameters<
  typeof database.query.members.findFirst
>[0];

export type GetUserPropsType = Parameters<
  typeof database.query.users.findFirst
>[0];

export type GetWorkspacePropsType = Parameters<
  typeof database.query.workspaces.findFirst
>[0];

export type GetProjectPropsType = Parameters<
  typeof database.query.projects.findFirst
>[0];
