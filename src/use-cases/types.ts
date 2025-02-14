import { Member, Profile, Project, Task, TaskStatus, User } from "@/db/schema";

export type UserId = number;

export type UserSession = {
  id: UserId;
};

export type GetWorkspaceMembersProfileUseCaseReturnType =
  | (Member & {
      user: {
        email: User["email"];
        profile: Pick<Profile, "image" | "displayName" | "bio">;
      };
    })[]
  | undefined;

export type GetTasksWithSearchQueries = {
  workspaceId: string;
  search?: string | null | undefined;
  projectId?: string | null | undefined;
  dueDate?: Date | null | undefined;
  status?: TaskStatus | null | undefined;
  assignedToMemberId?: string | null | undefined;
};

export type GetTasksWithSearchQueriesUseCaseReturn = (Task & {
  assignedTo: Member & {
    user: {
      email: Pick<User, "email">;
      profile: Pick<Profile, "image" | "displayName">;
    };
  };
  createdBy: Member;
  project: Project;
})[];

export type GetProfileWithUserEmailUseCaseReturn =
  | (Profile & { user: Pick<User, "email"> })
  | undefined;
