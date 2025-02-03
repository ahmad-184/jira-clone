import { database } from "@/db";
import { Profile, profiles } from "@/db/schema";
import { UserId } from "@/use-cases/types";
import { eq } from "drizzle-orm";
import { GetProfilePropsTypes } from "./type";

export async function createProfile(
  userId: UserId,
  displayName: string,
  image?: string,
) {
  const [profile] = await database
    .insert(profiles)
    .values({
      userId,
      image,
      displayName,
    })
    .onConflictDoNothing()
    .returning();
  return profile;
}

export async function updateProfile(
  userId: UserId,
  updateProfile: Partial<Profile>,
) {
  await database
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId));
}

export async function getProfile(
  userId: UserId,
  props: GetProfilePropsTypes = {},
) {
  const profile = await database.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
    ...props,
  });

  return profile;
}
