import {
  ACCEPTED_IMAGE_FILE_TYPE,
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from "@/app-config";
import { z } from "zod";

export const imageFileValidation = z.object({
  name: z.string(),
  type: z
    .string()
    .refine(type => type.startsWith("image/"), "File must be an image")
    .refine(
      type => ACCEPTED_IMAGE_FILE_TYPE.includes(type),
      "Only JPG, JPEG, SVG & PNG are accepted file formats",
    ),
  size: z
    .number()
    .max(
      MAX_UPLOAD_IMAGE_SIZE,
      `File size must be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
    ),
});
