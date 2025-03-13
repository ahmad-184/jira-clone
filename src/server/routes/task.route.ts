import "server-only";

import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.middleware";
import { returnError } from "../utils";
import { zValidator } from "@hono/zod-validator";
import {
  createTaskSchema,
  deleteTaskSchema,
  updateTaskSchema,
} from "@/validations/task.validation";
import { getMemberUseCase } from "@/use-cases/members";
import { PublicError } from "@/lib/errors";
import { hasPermission } from "@/lib/permission-system";
import {
  createTaskUseCase,
  deleteTasksUseCase,
  getHighestPositionTaskUseCase,
  getTasksWithSearchQueriesUseCase,
  getTaskUseCase,
  getTaskWithCreator,
  updateTasksPositionUseCase,
  updateTaskUseCase,
} from "@/use-cases/tasks";
import {
  getTaskSchema,
  getTasksQuerySchema,
  updateTasksPositionSchema,
} from "../validations/task.validator";
import { createUUID } from "@/util/uuid";

const createTaskValidator = zValidator("json", createTaskSchema);
const getTaskValidator = zValidator("query", getTaskSchema);
const getTasksQueryValidator = zValidator("query", getTasksQuerySchema);
const deleteTaskValidator = zValidator("json", deleteTaskSchema);
const updateTaskValidator = zValidator("json", updateTaskSchema);
const updateTasksPositionValidator = zValidator(
  "json",
  updateTasksPositionSchema,
);

const app = new Hono()
  // GET Methods
  // GET / get a task
  .get("/", authMiddleware, getTaskValidator, async c => {
    try {
      const user = c.get("user");
      const values = c.req.valid("query");

      const member = await getMemberUseCase(user.id, values.workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const canViewTask = hasPermission(
        member.role,
        "tasks",
        "view",
        undefined,
      );

      if (!canViewTask.permission)
        throw new PublicError(
          canViewTask?.message ?? "You are not allowed to view this task.",
        );

      const task = await getTaskUseCase(values.taskId);

      return c.json({ task });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // GET /tasks?query
  .get("/tasks", authMiddleware, getTasksQueryValidator, async c => {
    try {
      const user = c.get("user");
      const queries = c.req.valid("query");

      const member = await getMemberUseCase(user.id, queries.workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const canViewTask = hasPermission(
        member.role,
        "tasks",
        "view",
        undefined,
      );

      if (!canViewTask.permission)
        throw new PublicError(
          canViewTask?.message ?? "You are not allowed to view this task.",
        );

      const res = await getTasksWithSearchQueriesUseCase(queries);

      return c.json(res);
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // POST Methods
  // POST /create create new task
  .post("/create", authMiddleware, createTaskValidator, async c => {
    try {
      const user = c.get("user");
      const values = c.req.valid("json");

      const member = await getMemberUseCase(user.id, values.workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const canCreateTask = hasPermission(
        member.role,
        "tasks",
        "create",
        undefined,
      );

      if (!canCreateTask.permission)
        throw new PublicError(
          canCreateTask?.message ??
            "You are not allowed to create task for this workspace.",
        );

      const highestPositionTask = await getHighestPositionTaskUseCase(
        values.projectId,
        values.status,
      );

      const data = {
        ...values,
        position: 0,
        id: createUUID(),
      };

      if (highestPositionTask) data.position = highestPositionTask.position + 1;

      const { id } = await createTaskUseCase(data);

      const createdTask = await getTaskUseCase(id);

      return c.json({ task: createdTask });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // PUT Methods
  // PUT /update update a task
  .post("/update", authMiddleware, updateTaskValidator, async c => {
    try {
      const user = c.get("user");
      const values = c.req.valid("json");

      const member = await getMemberUseCase(user.id, values.workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const task = await getTaskWithCreator(values.id);

      const canUpdateTask = hasPermission(member.role, "tasks", "update", {
        member,
        task,
      });

      if (!canUpdateTask.permission)
        throw new PublicError(
          canUpdateTask?.message ??
            "You are not allowed to update task for this workspace.",
        );

      await updateTaskUseCase(values.id, values);

      const updatedTask = await getTaskUseCase(values.id);

      return c.json({
        task: updatedTask,
      });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // PUT /update-tasks-position update tasks position
  .post(
    "/update-tasks-position",
    authMiddleware,
    updateTasksPositionValidator,
    async c => {
      try {
        const user = c.get("user");
        const values = c.req.valid("json");

        const member = await getMemberUseCase(user.id, values.workspaceId);

        if (!member)
          throw new PublicError("You are not a member of this workspace.");

        const tasks = await updateTasksPositionUseCase(member, values.tasks);

        return c.json({
          tasks,
        });
      } catch (err: unknown) {
        return returnError(err, c);
      }
    },
  )
  // DELETE Methods
  // DELETE /delete delete a task
  .delete("/delete", authMiddleware, deleteTaskValidator, async c => {
    try {
      const user = c.get("user");
      const values = c.req.valid("json");

      const member = await getMemberUseCase(user.id, values.workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      await Promise.all(
        values.taskIds.map(async taskId => {
          const task = await getTaskWithCreator(taskId);

          const canDeleteTask = hasPermission(member.role, "tasks", "delete", {
            task,
            member,
          });

          if (!canDeleteTask.permission)
            throw new PublicError(
              canDeleteTask?.message ??
                "You are not allowed to delete this task.",
            );
        }),
      );

      await deleteTasksUseCase(values.taskIds);

      return c.json({ ids: values.taskIds });
    } catch (err) {
      return returnError(err, c);
    }
  });

export default app;
