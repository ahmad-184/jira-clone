import { hc } from "hono/client";
import { AppType } from "@/server/type";
import { env } from "@/env";

export const client = hc<AppType>(env.NEXT_PUBLIC_HOST_URL!);
