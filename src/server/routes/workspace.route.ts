import "server-only";

import { Hono } from "hono";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
} from "@/validations/workspace.validation";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middlewares/auth.middleware";
import { returnError } from "../utils";
import { PublicError } from "@/lib/errors";
import {
  createWorkspaceUseCase,
  deleteWorkspaceUseCase,
  getUserWorkspacesUseCase,
  getWorkspaceMembersProfileUseCase,
  getWorkspaceProjectsUseCase,
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
import { z } from "zod";

const createWorkspaceValidator = zValidator("json", createWorkspaceSchema);
const updateWorkspaceValidator = zValidator("json", updateWorkspaceSchema);
const updateWorkspaceParamValidator = zValidator(
  "param",
  z.object({ id: workspaceIdSchema }),
);
const deleteWorkspaceValidator = zValidator("json", deleteWorkspaceSchema);
const deleteWorkspaceParamsValidator = zValidator(
  "param",
  z.object({ id: workspaceIdSchema }),
);
const resetInviteCodeValidator = zValidator("param", resetInviteCodeSchema);
const joinWorkspaceParamsValidator = zValidator(
  "param",
  joinWorkspaceParamsSchema,
);
const joinWorkspaceBodyValidator = zValidator("json", joinWorkspaceBodySchema);
const workspaceMembersValidator = zValidator(
  "query",
  z.object({ workspaceId: workspaceIdSchema }),
);
const workspaceProjectsValidator = zValidator(
  "query",
  z.object({ workspaceId: workspaceIdSchema }),
);

const app = new Hono()
  // GET API METHODS
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
  // GET /members?workspaceId="xxxxxxx" get members of a workspace
  .get("/members", authMiddleware, workspaceMembersValidator, async c => {
    try {
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member) throw new PublicError("You not allowed to view members.");

      const canViewMembers = hasPermission(member.role, "members", "view", {
        member,
        user,
      });

      if (!canViewMembers.permission)
        throw new PublicError(
          canViewMembers?.message ?? "You not allowed to view members.",
        );

      const members = await getWorkspaceMembersProfileUseCase(workspaceId);

      return c.json({ members });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // GET /projects?workspaceId="xxxxxxx" get projects of a workspace
  .get("/projects", authMiddleware, workspaceProjectsValidator, async c => {
    try {
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member) throw new PublicError("You not allowed to view projects.");

      const canViewMembers = hasPermission(
        member.role,
        "projects",
        "view",
        undefined,
      );

      if (!canViewMembers.permission)
        throw new PublicError(
          canViewMembers?.message ?? "You not allowed to view projects.",
        );

      const projects = await getWorkspaceProjectsUseCase(workspaceId);

      return c.json({ projects });
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

      const currentMember = await getMemberUseCase(user.id, workspaceId);

      if (!currentMember)
        throw new PublicError("You are not a member of this workspace.");

      const canViewWorkspace = hasPermission(
        currentMember.role,
        "workspaces",
        "view",
        undefined,
      );

      if (!canViewWorkspace)
        throw new PublicError("You are not allowed to view this workspace.");

      if (!canViewWorkspace.permission)
        throw new PublicError(
          canViewWorkspace.message ??
            "You are not allowed to view this workspace.",
        );

      return c.json({ workspace });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // POST API METHODS
  // POST /create create workspace
  .post("/create", authMiddleware, createWorkspaceValidator, async c => {
    try {
      const user = c.get("user");
      const data = c.req.valid("json");

      if (user.id !== data.userId)
        throw new PublicError(
          "You are not allowed to create workspace for other users",
        );

      const workspace = await createWorkspaceUseCase({
        ...data,
        ownerId: data.userId,
      });

      return c.json({ workspace });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
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
  )
  // PUT API METHODS
  // PUT /update/:id update workspace
  .put(
    "/update/:id",
    authMiddleware,
    updateWorkspaceParamValidator,
    updateWorkspaceValidator,
    async c => {
      try {
        const user = c.get("user");
        const values = c.req.valid("json");

        const { id: workspaceId } = c.req.valid("param");
        const workspace = await getWorkspaceUseCase(workspaceId);

        if (!workspace) throw new PublicError("Workspace not found.");

        const currentMember = await getMemberUseCase(user.id, workspaceId);

        if (!currentMember)
          throw new PublicError("You are not a member of this workspace.");

        const canUpdateWorkspace = hasPermission(
          currentMember.role,
          "workspaces",
          "update",
          undefined,
        );

        if (!canUpdateWorkspace.permission)
          throw new PublicError(
            canUpdateWorkspace?.message ??
              "You are not allowed to update this workspace.",
          );

        await updateWorkspaceUseCase(workspaceId, values);

        return c.json({ id: workspaceId });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  )
  // PUT /reset-invite-code/:id reset invite code
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

        const currentMember = await getMemberUseCase(user.id, workspaceId);

        if (!currentMember)
          throw new PublicError("You are not a member of this workspace.");

        const canResetInviteCode = hasPermission(
          currentMember.role,
          "workspaces",
          "delete",
          undefined,
        );

        if (!canResetInviteCode.permission)
          throw new PublicError(
            canResetInviteCode?.message ??
              "You are not allowed to reset invite code.",
          );

        await resetWorkspaceInviteCodeUseCase(workspaceId);

        return c.json({ id: workspaceId });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  )
  // DELETE API METHODS
  // DELETE /delete/:id delete workspace
  .delete(
    "/delete/:id",
    authMiddleware,
    deleteWorkspaceParamsValidator,
    deleteWorkspaceValidator,
    async c => {
      try {
        const user = c.get("user");
        const { id: workspaceId } = c.req.valid("param");
        const values = c.req.valid("json");

        const workspace = await getWorkspaceUseCase(workspaceId);

        if (!workspace) throw new PublicError("Workspace not found.");
        if (workspace.name !== values.workspaceName)
          throw new PublicError("Workspace name does not match.");

        const currentMember = await getMemberUseCase(user.id, workspaceId);

        if (!currentMember)
          throw new PublicError("You are not a member of this workspace.");

        const canDeleteWorkspace = hasPermission(
          currentMember.role,
          "workspaces",
          "delete",
          undefined,
        );

        if (!canDeleteWorkspace.permission)
          throw new PublicError(
            canDeleteWorkspace?.message ??
              "You are not allowed to delete this workspace.",
          );

        await deleteWorkspaceUseCase(workspaceId);

        return c.json({ id: workspaceId });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  );

export default app;
