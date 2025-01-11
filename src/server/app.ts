import { Hono } from "hono";
import { handle } from "hono/vercel";

export const app = new Hono().basePath("/api");

export const routes = app;

export const METHODS = {
  GET: handle(app),
  POST: handle(app),
  PUT: handle(app),
  DELETE: handle(app),
};
