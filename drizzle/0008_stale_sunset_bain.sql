CREATE TYPE "public"."task-status" AS ENUM('BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');--> statement-breakpoint
CREATE TABLE "gf_project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"imageUrl" text,
	"workspaceId" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gf_task" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"workspaceId" text NOT NULL,
	"projectId" text NOT NULL,
	"assignedId" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"taskStatus" "task-status" NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gf_project" ADD CONSTRAINT "gf_project_workspaceId_gf_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."gf_workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_task" ADD CONSTRAINT "gf_task_workspaceId_gf_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."gf_workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_task" ADD CONSTRAINT "gf_task_projectId_gf_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."gf_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_task" ADD CONSTRAINT "gf_task_assignedId_gf_member_userId_fk" FOREIGN KEY ("assignedId") REFERENCES "public"."gf_member"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "projects_workspace_id_idx" ON "gf_project" USING btree ("workspaceId");--> statement-breakpoint
CREATE INDEX "tasks_project_id_idx" ON "gf_task" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "tasks_workspace_id_idx" ON "gf_task" USING btree ("workspaceId");--> statement-breakpoint
CREATE INDEX "profiles_user_id_idx" ON "gf_profile" USING btree ("userId");