import { Member, Profile, User } from "@/db/schema";

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
