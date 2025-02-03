import { Member, Profile, User } from "@/db/schema";

export type MemberWithUserEmailAndProfileType = Member & {
  user: {
    email: User["email"];
    profile: Pick<Profile, "displayName" | "image" | "bio">;
  };
};
