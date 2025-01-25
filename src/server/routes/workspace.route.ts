import "server-only";

import { Hono } from "hono";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/validations/workspace.validation";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middlewares/auth.middleware";
import { returnError } from "../utils";
import { PublicError } from "@/lib/errors";
import {
  createWorkspaceUseCase,
  deleteWorkspaceUseCase,
  getUserWorkspacesUseCase,
  getWorkspaceUseCase,
  resetWorkspaceInviteCodeUseCase,
  updateWorkspaceUseCase,
} from "@/use-cases/workspaces";
import { createMemberUseCase, getMemberUseCase } from "@/use-cases/members";
import {
  deleteWorkspaceSchema,
  joinWorkspaceParamsSchema,
  resetInviteCodeSchema,
  joinWorkspaceBodySchema,
} from "../validations/workspace.validation";
import { hasPermission } from "@/lib/permission-system";

const createWorkspaceValidator = zValidator("json", createWorkspaceSchema);
const updateWorkspaceValidator = zValidator("json", updateWorkspaceSchema);
const deleteWorkspaceValidator = zValidator("json", deleteWorkspaceSchema);
const resetInviteCodeValidator = zValidator("param", resetInviteCodeSchema);
const joinWorkspaceParamsValidator = zValidator(
  "param",
  joinWorkspaceParamsSchema,
);
const joinWorkspaceBodyValidator = zValidator("json", joinWorkspaceBodySchema);

const app = new Hono()
  // POST /create create workspace
  .post("/create", authMiddleware, createWorkspaceValidator, async c => {
    try {
      const user = c.get("user");

      const data = c.req.valid("json");

      if (user.id !== data.userId)
        throw new PublicError(
          "You are not allowed to create workspace for other users",
        );

      const workspace = await createWorkspaceUseCase(data);

      return c.json({ workspace });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // GET /user-workspaces get user workspaces
  .get("/user-workspaces", authMiddleware, async c => {
    try {
      const user = c.get("user");

      const workspaces = await getUserWorkspacesUseCase(user.id);

      return c.json({ workspaces });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // GET /:id get a workspace
  .get("/:id", authMiddleware, async c => {
    try {
      const user = c.get("user");

      const { id: workspaceId } = c.req.param();

      const workspace = await getWorkspaceUseCase(workspaceId);

      if (!workspace) throw new PublicError("Workspace not found.");

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const canViewWorkspace = hasPermission(
        member,
        "workspaces",
        "view",
        workspace,
      );

      if (!canViewWorkspace)
        throw new PublicError("You are not allowed to view this workspace.");

      return c.json({ workspace });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // PUT /update/:id update workspace
  .put("/update/:id", authMiddleware, updateWorkspaceValidator, async c => {
    try {
      const user = c.get("user");

      const values = c.req.valid("json");

      const { id: workspaceId } = c.req.param();

      const workspace = await getWorkspaceUseCase(workspaceId);

      if (!workspace) throw new PublicError("Workspace not found.");

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const canUpdateWorkspace = hasPermission(
        member,
        "workspaces",
        "update",
        workspace,
      );

      if (!canUpdateWorkspace)
        throw new PublicError("You are not allowed to update this workspace.");

      await updateWorkspaceUseCase(workspaceId, values);

      return c.json({ id: workspaceId });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // DELETE /delete/:id delete workspace
  .delete("/delete/:id", authMiddleware, deleteWorkspaceValidator, async c => {
    try {
      const user = c.get("user");

      const { id: workspaceId } = c.req.param();

      const values = c.req.valid("json");

      const workspace = await getWorkspaceUseCase(workspaceId);

      if (!workspace) throw new PublicError("Workspace not found.");
      if (workspace.name !== values.workspaceName)
        throw new PublicError("Workspace name does not match.");

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const canDeleteWorkspace = hasPermission(
        member,
        "workspaces",
        "delete",
        workspace,
      );

      if (!canDeleteWorkspace)
        throw new PublicError("You are not allowed to delete this workspace.");

      await deleteWorkspaceUseCase(workspaceId);

      return c.json({ id: workspaceId });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // POST /reset-invite-code/:id reset invite code
  .put(
    "/reset-invite-code/:id",
    authMiddleware,
    resetInviteCodeValidator,
    async c => {
      try {
        const user = c.get("user");

        const { id: workspaceId } = c.req.valid("param");

        const workspace = await getWorkspaceUseCase(workspaceId);

        if (!workspace) throw new PublicError("Workspace not found.");

        const member = await getMemberUseCase(user.id, workspaceId);

        if (!member)
          throw new PublicError("You are not a member of this workspace.");

        const canResetInviteCode = hasPermission(
          member,
          "workspaces",
          "update",
          workspace,
        );

        if (!canResetInviteCode)
          throw new PublicError("You are not allowed to reset invite code.");

        await resetWorkspaceInviteCodeUseCase(workspaceId);

        return c.json({ id: workspaceId });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  )
  // POST /:id/join join workspace
  .post(
    "/:id/join",
    authMiddleware,
    joinWorkspaceParamsValidator,
    joinWorkspaceBodyValidator,
    async c => {
      try {
        const user = c.get("user");

        const { id: workspaceId } = c.req.valid("param");

        const { inviteCode } = c.req.valid("json");

        const workspace = await getWorkspaceUseCase(workspaceId);

        if (!workspace) throw new PublicError("Workspace not found.");

        if (String(workspace.inviteCode) !== String(inviteCode))
          throw new PublicError("Invite code does not match.");

        const member = await getMemberUseCase(user.id, workspaceId);

        if (member)
          throw new PublicError("You are already a member of this workspace.");

        await createMemberUseCase({
          userId: user.id,
          workspaceId,
          role: "MEMBER",
        });

        return c.json({ id: workspaceId });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  );

export default app;
