import "server-only";

import { database } from "@/db";
import { User, accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserId } from "@/use-cases/types";
import { getAccountByUserId } from "./accounts";
import { hashPassword } from "./utils";
import { GetUserPropsType } from "./type";

export async function deleteUser(userId: UserId) {
  await database.delete(users).where(eq(users.id, userId));
}

export async function getUser(userId: UserId, props: GetUserPropsType = {}) {
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
    ...props,
  });

  return user;
}

export async function createUser(email: string) {
  const [user] = await database
    .insert(users)
    .values({
      email,
    })
    .returning();
  return user;
}

export async function createMagicUser(email: string) {
  const [user] = await database
    .insert(users)
    .values({
      email,
      emailVerified: new Date(),
    })
    .returning();

  await database
    .insert(accounts)
    .values({
      userId: user.id,
      accountType: "EMAIL",
    })
    .returning();

  return user;
}

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  const account = await getAccountByUserId(user.id);

  if (!account) {
    return false;
  }

  const salt = account.salt;
  const savedPassword = account.password;

  if (!salt || !savedPassword) {
    return false;
  }

  const hash = await hashPassword(plainTextPassword, salt);
  return account.password == hash;
}

export async function getUserByEmail(
  email: string,
  props: GetUserPropsType = {},
) {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email),
    ...props,
  });

  return user;
}

export async function getMagicUserAccountByEmail(
  email: string,
  props: GetUserPropsType = {},
) {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email),
    ...props,
  });

  return user;
}

export async function setEmailVerified(userId: UserId) {
  await database
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await database.update(users).set(updatedUser).where(eq(users.id, userId));
}
