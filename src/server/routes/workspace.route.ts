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
  getUserWorkspacesUseCase,
  getWorkspaceUseCase,
  updateWorkspaceUseCase,
} from "@/use-cases/workspaces";
import { getMemberUseCase } from "@/use-cases/members";
import { uuidValidation } from "@/validations/index.validation";

const createWorkspaceValidator = zValidator("json", createWorkspaceSchema);
const updateWorkspaceValidator = zValidator("json", updateWorkspaceSchema);
const paramsIdValidator = zValidator("param", uuidValidation);

const app = new Hono()
  // create workspace
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
  // get a workspace
  .get("/:id", authMiddleware, paramsIdValidator, async c => {
    try {
      const user = c.get("user");
      const { id: workspaceId } = c.req.valid("param");

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const workspace = await getWorkspaceUseCase(workspaceId);

      return c.json({ workspace });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // get user workspaces
  .get("/user-workspaces", authMiddleware, async c => {
    try {
      const user = c.get("user");

      const workspaces = await getUserWorkspacesUseCase(user.id);

      return c.json({ workspaces });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // update workspace
  .put(
    "/update/:id",
    authMiddleware,
    updateWorkspaceValidator,
    paramsIdValidator,
    async c => {
      try {
        const user = c.get("user");

        const data = c.req.valid("json");
        const { id: workspaceId } = c.req.valid("param");

        const member = await getMemberUseCase(user.id, workspaceId);

        if (!member)
          throw new PublicError("You are not a member of this workspace.");

        if (member.role !== "ADMIN")
          throw new PublicError(
            "You are not allowed to update this workspace.",
          );

        await updateWorkspaceUseCase(workspaceId, data);

        return c.json({ id: workspaceId });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  );

export default app;
