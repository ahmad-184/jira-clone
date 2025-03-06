import { TaskStatus } from "@/db/schema";

export const statusNames: Record<TaskStatus, string> = {
  BACKLOG: "BACK LOG",
  TODO: "TO DO",
  IN_PROGRESS: "IN PROGRESS",
  IN_REVIEW: "IN REVIEW",
  DONE: "DONE",
};
