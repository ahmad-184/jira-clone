ALTER TABLE "gf_accounts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_accounts" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gf_magic_links" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_magic_links" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gf_member" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_member" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gf_member" ALTER COLUMN "workspaceId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_profile" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_profile" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gf_reset_tokens" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_reset_tokens" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gf_session" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_session" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gf_verify_email_otps" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_verify_email_otps" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gf_verify_email_tokens" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_verify_email_tokens" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gf_workspace" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gf_workspace" ALTER COLUMN "id" DROP DEFAULT;