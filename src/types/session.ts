import { User } from "@/db/schema";
import { Session } from "@/db/schema";

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
