import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";

declare global {
  // eslint-disable-next-line no-var
  var cachedDrizzle: PostgresJsDatabase<typeof schema>;
}

export type UploadedFile = {
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  existing: boolean;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  url: string;
  signature: string;
  type: string;
  version: number;
  version_id: string;
  width: number;
  tags: string[];
};

export type FileWithPreview = File & { preview: string };
