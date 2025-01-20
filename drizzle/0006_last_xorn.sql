ALTER TABLE "gf_user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gf_workspace" ADD COLUMN "inviteCode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gf_workspace" ADD CONSTRAINT "gf_workspace_inviteCode_unique" UNIQUE("inviteCode");