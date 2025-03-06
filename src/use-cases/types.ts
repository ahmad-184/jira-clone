import {
  Member,
  Profile,
  Project,
  Tag,
  Task,
  TaskStatus,
  User,
} from "@/db/schema";

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

type MemberWithUserAndProfile = Member & {
  user: Pick<User, "email"> & {
    profile: Pick<Profile, "image" | "displayName">;
  };
};

export type GetTaskUseCaseReturn = Task & {
  assignedTo: MemberWithUserAndProfile;
  createdBy: MemberWithUserAndProfile;
  project: Pick<Project, "id" | "name" | "imageUrl">;
  taskTags: {
    tag: Pick<Tag, "name" | "id">;
  }[];
};

export type GetTasksWithSearchQueriesUseCaseReturn = GetTaskUseCaseReturn[];

export type GetTaskWithCreatorUseCaseReturn = Task & {
  createdBy: Member;
};

export type GetProfileWithUserEmailUseCaseReturn =
  | (Profile & { user: Pick<User, "email"> })
  | undefined;
