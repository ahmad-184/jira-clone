import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.middleware";
import { returnError } from "../utils";
import { getMemberUseCase } from "@/use-cases/members";
import { zValidator } from "@hono/zod-validator";
import { createTagSchema } from "@/validations/tag.validation";
import { PublicError } from "@/lib/errors";
import { hasPermission } from "@/lib/permission-system";
import { createTagUseCase, getTagsUseCase } from "@/use-cases/tag";
import { z } from "zod";
import { workspaceIdSchema } from "@/validations/workspace.validation";

const getTagsValidator = zValidator(
  "query",
  z.object({ workspaceId: workspaceIdSchema }),
);
const createTagValidator = zValidator("json", createTagSchema);

const app = new Hono()
  // GET Methods
  // GET /?workspaceId="" get workspace tags
  .get("/", authMiddleware, getTagsValidator, async c => {
    try {
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMemberUseCase(user.id, workspaceId);

      if (!member) throw new PublicError("You not allowed to view tags.");

      const tags = await getTagsUseCase(workspaceId);

      return c.json({ tags });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  })
  // POST Methods
  // POST /create create new tag
  .post("/create", authMiddleware, createTagValidator, async c => {
    try {
      const user = c.get("user");
      const values = c.req.valid("json");

      const member = await getMemberUseCase(user.id, values.workspaceId);

      if (!member) throw new PublicError("You not allowed to view members.");

      const canCreate = hasPermission(member.role, "tags", "create");

      if (!canCreate.permission)
        throw new PublicError(
          canCreate?.message ?? "You not allowed to create tag.",
        );

      await createTagUseCase(values);

      return c.json({ id: values.id });
    } catch (err: unknown) {
      return returnError(err, c);
    }
  });

export default app;
