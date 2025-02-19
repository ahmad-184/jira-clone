import { createUUID } from "@/util/uuid";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
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

export const taskStatusEnum = pgEnum("task-status", [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
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
    unique("members_user_id_workspace_id_unique").on(
      table.userId,
      table.workspaceId,
    ),
  ],
);

export const projects = pgTable(
  "gf_project",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    name: text("name").notNull(),
    imageUrl: text("imageUrl"),
    workspaceId: text("workspaceId")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [index("projects_workspace_id_idx").on(table.workspaceId)],
);

export const tasks = pgTable(
  "gf_task",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    name: text("name").notNull(),
    createdById: text("createdById")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    workspaceId: text("workspaceId")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    projectId: text("projectId")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    assignedToMemberId: text("assignedToMemberId")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    description: text("description"),
    dueDate: timestamp("dueDate", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    status: taskStatusEnum("taskStatus").notNull(),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  table => [
    index("tasks_project_id_idx").on(table.projectId),
    index("tasks_workspace_id_idx").on(table.workspaceId),
    index("tasks_member_created_id_idx").on(table.createdById),
    index("tasks_member_assigned_to_id_idx").on(table.assignedToMemberId),
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
  projects: many(projects),
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

export const projectsRelations = relations(projects, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [tasks.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  createdBy: one(members, {
    fields: [tasks.createdById],
    references: [members.id],
  }),
  assignedTo: one(members, {
    fields: [tasks.assignedToMemberId],
    references: [members.id],
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
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;

export type Role = (typeof memberRoleEnum.enumValues)[number];
export type AccountType = (typeof accountTypeEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
