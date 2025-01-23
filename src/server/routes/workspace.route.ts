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
  updateWorkspaceUseCase,
} from "@/use-cases/workspaces";
import { getMemberUseCase } from "@/use-cases/members";
import { deleteWorkspaceSchema } from "../validations/workspace.validation";

const createWorkspaceValidator = zValidator("json", createWorkspaceSchema);
const updateWorkspaceValidator = zValidator("json", updateWorkspaceSchema);
const deleteWorkspaceValidator = zValidator("json", deleteWorkspaceSchema);

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

      const member = await getMemberUseCase(user.id, workspaceId);
      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const workspace = await getWorkspaceUseCase(workspaceId);

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

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      if (member.role !== "ADMIN")
        throw new PublicError("You are not allowed to update this workspace.");
      console.log(values);
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

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");
      if (member.role !== "ADMIN")
        throw new PublicError("You are not allowed to delete this workspace.");

      const workspace = await getWorkspaceUseCase(workspaceId);

      if (!workspace) throw new PublicError("Workspace not found.");

      if (workspace.name !== values.workspaceName)
        throw new PublicError("Workspace name does not match.");

      await deleteWorkspaceUseCase(workspaceId);

      return c.json({ id: workspaceId });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  });

export default app;
