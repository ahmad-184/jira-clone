CREATE TYPE "public"."member_role" AS ENUM('ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TABLE "gf_member" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"workspaceId" serial NOT NULL,
	"role" "member_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gf_member" ADD CONSTRAINT "gf_member_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_member" ADD CONSTRAINT "gf_member_workspaceId_gf_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."gf_workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "members_user_id_workspace_id_idx" ON "gf_member" USING btree ("userId","workspaceId");--> statement-breakpoint
CREATE INDEX "members_workspace_id_idx" ON "gf_member" USING btree ("workspaceId");