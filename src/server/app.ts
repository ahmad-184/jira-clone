import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import tagRoutes from "./routes/tag.route";

export const app = new Hono().basePath("/api");

app.use("/api/*", cors());

export const routes = app
  .route("/auth", authRoutes)
  .route("/user", userRoutes)
  .route("/workspace", workspaceRoutes)
  .route("/member", memberRoutes)
  .route("/project", projectRoutes)
  .route("/task", taskRoutes)
  .route("/tag", tagRoutes);

export const METHODS = {
  GET: handle(app),
  POST: handle(app),
  PUT: handle(app),
  DELETE: handle(app),
};
