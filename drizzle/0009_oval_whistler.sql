ALTER TABLE "gf_task" DROP CONSTRAINT "gf_task_assignedId_gf_member_userId_fk";
--> statement-breakpoint
ALTER TABLE "gf_task" ADD CONSTRAINT "gf_task_assignedId_workspaceId_gf_member_userId_workspaceId_fk" FOREIGN KEY ("assignedId","workspaceId") REFERENCES "public"."gf_member"("userId","workspaceId") ON DELETE no action ON UPDATE no action;