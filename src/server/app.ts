import { Hono } from "hono";
import { handle } from "hono/vercel";

// routes
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

export const app = new Hono().basePath("/api");

export const routes = app
  // auth routes
  .route("/auth", authRoutes)
  // user routes
  .route("/user", userRoutes);

export const METHODS = {
  GET: handle(app),
  POST: handle(app),
  PUT: handle(app),
  DELETE: handle(app),
};
