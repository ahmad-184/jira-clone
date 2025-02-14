import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.middleware";
import { returnError } from "../utils";
import { zValidator } from "@hono/zod-validator";
import { createTaskSchema } from "@/validations/task.validation";
import { getMemberUseCase } from "@/use-cases/members";
import { PublicError } from "@/lib/errors";
import { hasPermission } from "@/lib/permission-system";
import {
  createTaskUseCase,
  getHighestPositionTaskUseCase,
  getTasksWithSearchQueriesUseCase,
} from "@/use-cases/tasks";
import { getTasksQuerySchema } from "../validations/task.validator";

const createTaskValidator = zValidator("json", createTaskSchema);
const getTasksQueryValidator = zValidator("query", getTasksQuerySchema);

const app = new Hono()
  // GET Methods
  // GET /?query
  .get("/", authMiddleware, getTasksQueryValidator, async c => {
    try {
      const user = c.get("user");
      const queries = c.req.valid("query");

      const member = await getMemberUseCase(user.id, queries.workspaceId);

      if (!member)
        throw new PublicError("You are not a member of this workspace.");

      const tasks = await getTasksWithSearchQueriesUseCase(queries);

      return c.json({ tasks });
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
      };

      if (highestPositionTask) data.position = highestPositionTask.position + 1;

      await createTaskUseCase(data);

      return c.json({ projectId: values.projectId });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  });

export default app;
