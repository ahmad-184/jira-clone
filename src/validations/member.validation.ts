import { z } from "zod";

export const memberIdSchema = z.string().min(1);

export const deleteMemberSchema = z.object({
  memberId: memberIdSchema,
});

export const updateMemberSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
});
