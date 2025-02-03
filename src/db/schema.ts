import { createUUID } from "@/util/uuid";
import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
  "EMAIL",
  "GOOGLE",
  "GITHUB",
]);

export const memberRoleEnum = pgEnum("member_role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
]);

export const users = pgTable("gf_user", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const accounts = pgTable(
  "gf_accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountType: accountTypeEnum("accountType").notNull(),
    githubId: text("githubId").unique(),
    googleId: text("googleId").unique(),
    password: text("password"),
    salt: text("salt"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [
    index("user_id_account_type_idx").on(table.userId, table.accountType),
  ],
);

export const magicLinks = pgTable(
  "gf_magic_links",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    email: text("email").notNull().unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [index("magic_links_token_idx").on(table.token)],
);

export const resetTokens = pgTable(
  "gf_reset_tokens",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [index("reset_tokens_token_idx").on(table.token)],
);

export const verifyEmailTokens = pgTable(
  "gf_verify_email_tokens",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [index("verify_email_tokens_token_idx").on(table.token)],
);

export const verifyEmailOtps = pgTable(
  "gf_verify_email_otps",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    otp: text("otp"),
    otpExpiresAt: timestamp("otpExpiresAt", { mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [index("verify_email_otps_otp_idx").on(table.otp)],
);

export const profiles = pgTable(
  "gf_profile",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    displayName: text("displayName"),
    image: text("image"),
    bio: text("bio").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [index("profiles_user_id_idx").on(table.userId)],
);

export const sessions = pgTable(
  "gf_session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [index("sessions_user_id_idx").on(table.userId)],
);

export const workspaces = pgTable("gf_workspace", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createUUID()),
  ownerId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  imageUrl: text("imageUrl"),
  inviteCode: text("inviteCode").unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const members = pgTable(
  "gf_member",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: text("workspaceId")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [
    index("members_user_id_workspace_id_idx").on(
      table.userId,
      table.workspaceId,
    ),
    index("members_workspace_id_idx").on(table.workspaceId),
  ],
);

/**
 * RELATIONSHIPS
 *
 * Here you can define drizzle relationships between table which helps improve the type safety
 * in your code.
 **/

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  workspaces: many(workspaces),
  members: many(members),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(members),
}));

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type MagicLink = typeof magicLinks.$inferSelect;
export type ResetToken = typeof resetTokens.$inferSelect;
export type VerifyEmailToken = typeof verifyEmailTokens.$inferSelect;
export type VerifyEmailOtp = typeof verifyEmailOtps.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type Member = typeof members.$inferSelect;

export type Role = (typeof memberRoleEnum.enumValues)[number];
export type AccountType = (typeof accountTypeEnum.enumValues)[number];
