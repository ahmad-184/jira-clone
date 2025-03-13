import "server-only";

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { returnError } from "../utils";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  deleteMemberUseCase,
  getMemberByIdUseCase,
  getMemberUseCase,
  updateMemberUseCase,
} from "@/use-cases/members";
import { hasPermission } from "@/lib/permission-system";
import { PublicError } from "@/lib/errors";
import { getWorkspaceMembersUseCase } from "@/use-cases/workspaces";
import { workspaceIdSchema } from "@/validations/workspace.validation";
import {
  deleteMemberSchema,
  memberIdSchema,
  updateMemberSchema,
} from "@/validations/member.validation";

const deleteMemberValidator = zValidator("param", deleteMemberSchema);
const updateMemberValidator = zValidator("json", updateMemberSchema);
const memberIdValidator = zValidator(
  "param",
  z.object({ memberId: memberIdSchema }),
);
const workspaceIdValidator = zValidator(
  "query",
  z.object({ workspaceId: workspaceIdSchema }),
);

const app = new Hono()
  // GET /current-member?workspaceId="xxxxxx"
  .get("/current-member", authMiddleware, workspaceIdValidator, async c => {
    try {
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");
      const member = await getMemberUseCase(user.id, workspaceId);
      return c.json({ member });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // UPDATE /:memberId update a member
  .put(
    "/:memberId",
    authMiddleware,
    memberIdValidator,
    updateMemberValidator,
    async c => {
      try {
        const user = c.get("user");
        const { memberId } = c.req.valid("param");
        const values = c.req.valid("json");

        const memberToUpdate = await getMemberByIdUseCase(memberId);

        if (!memberToUpdate) throw new PublicError("Member dos not exist.");

        const workspaceMembers = await getWorkspaceMembersUseCase(
          memberToUpdate.workspaceId,
        );

        const currentMember = workspaceMembers.find(
          member => member.userId === user.id,
        );

        if (!currentMember)
          throw new PublicError("You not allowed to update this member.");

        const canUpdateMember = hasPermission(
          currentMember.role,
          "members",
          "update",
          { member: memberToUpdate, user },
        );

        if (!!values.role) {
          const canUpdateMemberRole = hasPermission(
            currentMember.role,
            "members",
            "update.role",
            { member: memberToUpdate, user },
          );

          if (!canUpdateMemberRole.permission)
            throw new PublicError(
              canUpdateMemberRole?.message ??
                "You not allowed to update this member role.",
            );
        }

        if (!canUpdateMember.permission)
          throw new PublicError(
            canUpdateMember?.message ??
              "You not allowed to update this member.",
          );

        await updateMemberUseCase(memberToUpdate.id, values);

        return c.json({ id: memberId });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  )
  // DELETE /:memberId delete a member
  .delete("/:memberId", authMiddleware, deleteMemberValidator, async c => {
    try {
      const user = c.get("user");
      const { memberId } = c.req.valid("param");

      const memberToDelete = await getMemberByIdUseCase(memberId);

      if (!memberToDelete) throw new PublicError("Member dos not exist.");

      const workspaceMembers = await getWorkspaceMembersUseCase(
        memberToDelete.workspaceId,
      );

      const currentMember = workspaceMembers.find(
        member => member.userId === user.id,
      );

      if (!currentMember)
        throw new PublicError("You not allowed to delete this member.");

      if (workspaceMembers.length === 1)
        throw new PublicError(
          "You can not delete the last member of a workspace.",
        );

      const canDeleteMember = hasPermission(
        currentMember.role,
        "members",
        "delete",
        { member: memberToDelete, user },
      );

      if (!canDeleteMember.permission)
        throw new PublicError(
          canDeleteMember?.message ?? "You not allowed to delete this member.",
        );

      await deleteMemberUseCase(memberToDelete.id);

      return c.json({ id: memberId });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  });

export default app;
