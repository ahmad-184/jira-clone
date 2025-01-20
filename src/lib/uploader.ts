import { createUUID } from "@/util/uuid";
import axios, { type AxiosProgressEvent } from "axios";
import { toast } from "sonner";
import { env } from "@/env";
import { imageFileValidation } from "@/validations/index.validation";
import { UploadedFile } from "@/types";

const {
  NEXT_PUBLIC_CLOUDINARY_API_KEY,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER,
  NEXT_PUBLIC_CLOUDINARY_PRESET,
} = env;

type StartUploadImageProps = {
  files: File[];
  setIsUploading?: (isUploading: boolean) => void;
  setProgress?: (progress: number) => void;
};

export const startUploadImage = async ({
  files,
  setIsUploading,
  setProgress,
}: StartUploadImageProps) => {
  try {
    if (!files.length) return;

    const uploadedFiles: { file: UploadedFile; type: "image" }[] = [];
    if (setIsUploading) setIsUploading(true);
    if (setProgress) setProgress(0);

    for (const file of files) {
      const formData = new FormData();

      const { error } = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }

      formData.append("file", file);
      formData.append("upload_preset", NEXT_PUBLIC_CLOUDINARY_PRESET);
      formData.append("api_key", NEXT_PUBLIC_CLOUDINARY_API_KEY);
      formData.append("cloud_name", NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
      formData.append("folder", NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER);
      formData.append("public_id", `${file.name}-${createUUID()}`);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              const { loaded, total = 0 } = progressEvent;
              const percent = Math.floor((loaded * 100) / total);
              if (percent <= 100) {
                if (setProgress) setProgress(percent);
              }
            },
          },
        );

        if (setProgress) setProgress(0);
        uploadedFiles.push({
          file: res.data as UploadedFile,
          type: "image",
        });
      } catch (err) {
        toast.error("Something went wrong, please try again");
        console.log(err);
      }
    }
    return uploadedFiles;
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong, please try again");
  } finally {
    if (setIsUploading) setIsUploading(false);
    if (setProgress) setProgress(0);
  }
};

const validateFile = (file: File) => {
  const { success, error } = imageFileValidation.safeParse({
    name: file.name,
    type: file.type,
    size: file.size,
  });

  if (!success) return { error: error?.errors[0].message };

  return {};
};
