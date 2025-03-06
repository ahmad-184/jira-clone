CREATE TABLE "gf_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"workspaceId" text NOT NULL,
	CONSTRAINT "unique_tag_name_per_workspace" UNIQUE("workspaceId","name")
);
--> statement-breakpoint
CREATE TABLE "gf_task_tags" (
	"taskId" text NOT NULL,
	"tagId" text NOT NULL,
	CONSTRAINT "gf_task_tags_taskId_tagId_pk" PRIMARY KEY("taskId","tagId")
);
--> statement-breakpoint
ALTER TABLE "gf_task" RENAME COLUMN "assignedId" TO "createdById";--> statement-breakpoint
ALTER TABLE "gf_task" DROP CONSTRAINT "gf_task_assignedId_workspaceId_gf_member_userId_workspaceId_fk";
--> statement-breakpoint
ALTER TABLE "gf_task" ADD COLUMN "assignedToMemberId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gf_task" ADD COLUMN "dueDate" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "gf_task" ADD COLUMN "tags" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "gf_tags" ADD CONSTRAINT "gf_tags_workspaceId_gf_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."gf_workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_task_tags" ADD CONSTRAINT "gf_task_tags_taskId_gf_task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."gf_task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_task_tags" ADD CONSTRAINT "gf_task_tags_tagId_gf_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."gf_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tags_workspace_id_idx" ON "gf_tags" USING btree ("workspaceId");--> statement-breakpoint
CREATE INDEX "task_tags_task_id_idx" ON "gf_task_tags" USING btree ("taskId");--> statement-breakpoint
CREATE INDEX "task_tags_tag_id_idx" ON "gf_task_tags" USING btree ("tagId");--> statement-breakpoint
ALTER TABLE "gf_task" ADD CONSTRAINT "gf_task_createdById_gf_member_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."gf_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_task" ADD CONSTRAINT "gf_task_assignedToMemberId_gf_member_id_fk" FOREIGN KEY ("assignedToMemberId") REFERENCES "public"."gf_member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_task" ADD CONSTRAINT "gf_task_tags_gf_tags_id_fk" FOREIGN KEY ("tags") REFERENCES "public"."gf_tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tasks_member_created_id_idx" ON "gf_task" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "tasks_member_assigned_to_id_idx" ON "gf_task" USING btree ("assignedToMemberId");--> statement-breakpoint
CREATE INDEX "task_workspace_status_idx" ON "gf_task" USING btree ("workspaceId","taskStatus");--> statement-breakpoint
CREATE INDEX "task_project_position_idx" ON "gf_task" USING btree ("projectId","position");