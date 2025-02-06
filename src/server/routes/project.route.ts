import "server-only";

import { Hono } from "hono";
import { returnError } from "../utils";
import { zValidator } from "@hono/zod-validator";
import {
  createProjectSchema,
  deleteProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "@/validations/project.validation";
import { z } from "zod";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMemberUseCase } from "@/use-cases/members";
import {
  createProjectUseCase,
  deleteProjectUseCase,
  getProjectUseCase,
  updateProjectUseCase,
} from "@/use-cases/projects";
import { PublicError } from "@/lib/errors";
import { hasPermission } from "@/lib/permission-system";

const getProjectValidator = zValidator(
  "param",
  z.object({
    projectId: projectIdSchema,
  }),
);
const createProjectValidator = zValidator("json", createProjectSchema);
const updateProjectValidator = zValidator("json", updateProjectSchema);
const updateProjectParamValidator = zValidator(
  "param",
  z.object({
    id: projectIdSchema,
  }),
);
const deleteProjectValidator = zValidator("json", deleteProjectSchema);
const deleteProjectParamsValidator = zValidator(
  "param",
  z.object({
    id: projectIdSchema,
  }),
);

const app = new Hono()
  // GET Methods
  // GET /:projectId get a project by project id
  .get("/:projectId", authMiddleware, getProjectValidator, async c => {
    try {
      const user = c.get("user");
      const { projectId } = c.req.valid("param");

      const project = await getProjectUseCase(projectId);

      if (!project) throw new PublicError("Project not found.");

      const member = await getMemberUseCase(user.id, project.workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this project.");

      const canViewThisProject = hasPermission(
        member.role,
        "projects",
        "view",
        undefined,
      );

      if (!canViewThisProject.permission)
        throw new PublicError(
          canViewThisProject?.message ??
            "You are not allowed to view this project.",
        );

      return c.json({ project });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // POST Methods
  // POST /create create a project
  .post("/create", authMiddleware, createProjectValidator, async c => {
    try {
      const user = c.get("user");
      const values = c.req.valid("json");

      const member = await getMemberUseCase(user.id, values.workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const canCreateProject = hasPermission(
        member.role,
        "projects",
        "create",
        undefined,
      );

      if (!canCreateProject.permission)
        throw new PublicError(
          canCreateProject?.message ??
            "You are not allowed to create a project in this workspace.",
        );

      const newProject = await createProjectUseCase(values);

      return c.json({ projectId: newProject.id });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // PUT API METHODS
  // PUT /update/:id update workspace
  .put(
    "/update/:id",
    authMiddleware,
    updateProjectParamValidator,
    updateProjectValidator,
    async c => {
      try {
        const user = c.get("user");
        const values = c.req.valid("json");

        const { id: projectId } = c.req.valid("param");

        const project = await getProjectUseCase(projectId);

        if (!project) throw new PublicError("project not found.");

        const currentMember = await getMemberUseCase(
          user.id,
          project.workspaceId,
        );

        if (!currentMember)
          throw new PublicError("You are not a member of this workspace.");

        const canUpdateProject = hasPermission(
          currentMember.role,
          "workspaces",
          "update",
          undefined,
        );

        if (!canUpdateProject.permission)
          throw new PublicError(
            canUpdateProject?.message ??
              "You are not allowed to update this project.",
          );

        await updateProjectUseCase(projectId, values);

        return c.json({ id: projectId });
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
    deleteProjectParamsValidator,
    deleteProjectValidator,
    async c => {
      try {
        const user = c.get("user");
        const { id: projectId } = c.req.param();
        const values = c.req.valid("json");

        const project = await getProjectUseCase(projectId);

        if (!project) throw new PublicError("Project not found.");
        if (project.name !== values.projectName)
          throw new PublicError("Project name does not match.");

        const currentMember = await getMemberUseCase(
          user.id,
          project.workspaceId,
        );

        if (!currentMember)
          throw new PublicError("You are not a member of this workspace.");

        const canDeleteProject = hasPermission(
          currentMember.role,
          "projects",
          "delete",
          undefined,
        );

        if (!canDeleteProject.permission)
          throw new PublicError(
            canDeleteProject?.message ??
              "You are not allowed to delete this project.",
          );

        await deleteProjectUseCase(projectId);

        return c.json({ id: projectId });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  );

export default app;
