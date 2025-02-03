import { Hono } from "hono";
import { handle } from "hono/vercel";

// routes
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";

export const app = new Hono().basePath("/api");

export const routes = app
  // auth routes
  .route("/auth", authRoutes)
  // user routes
  .route("/user", userRoutes)
  // workspace routes
  .route("/workspace", workspaceRoutes)
  // member routes
  .route("/member", memberRoutes);

export const METHODS = {
  GET: handle(app),
  POST: handle(app),
  PUT: handle(app),
  DELETE: handle(app),
};
