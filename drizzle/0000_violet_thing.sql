CREATE TYPE "public"."account_type" AS ENUM('EMAIL', 'GOOGLE', 'GITHUB');--> statement-breakpoint
CREATE TABLE "gf_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"accountType" "account_type" NOT NULL,
	"githubId" text,
	"googleId" text,
	"password" text,
	"salt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gf_accounts_githubId_unique" UNIQUE("githubId"),
	CONSTRAINT "gf_accounts_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
CREATE TABLE "gf_magic_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gf_magic_links_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "gf_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"displayName" text,
	"image" text,
	"bio" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gf_profile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "gf_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gf_reset_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "gf_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gf_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"emailVerified" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gf_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "gf_verify_email_otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"otp" text,
	"otpExpiresAt" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gf_verify_email_otps_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "gf_verify_email_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gf_verify_email_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "gf_accounts" ADD CONSTRAINT "gf_accounts_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_profile" ADD CONSTRAINT "gf_profile_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_reset_tokens" ADD CONSTRAINT "gf_reset_tokens_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_session" ADD CONSTRAINT "gf_session_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_verify_email_otps" ADD CONSTRAINT "gf_verify_email_otps_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gf_verify_email_tokens" ADD CONSTRAINT "gf_verify_email_tokens_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_account_type_idx" ON "gf_accounts" USING btree ("userId","accountType");--> statement-breakpoint
CREATE INDEX "magic_links_token_idx" ON "gf_magic_links" USING btree ("token");--> statement-breakpoint
CREATE INDEX "reset_tokens_token_idx" ON "gf_reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "gf_session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "verify_email_otps_otp_idx" ON "gf_verify_email_otps" USING btree ("otp");--> statement-breakpoint
CREATE INDEX "verify_email_tokens_token_idx" ON "gf_verify_email_tokens" USING btree ("token");