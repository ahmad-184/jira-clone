import { ACCEPTED_IMAGE_FILE_TYPE } from "@/app-config";
import UploadIcon from "@/icons/upload-icon";
import { cn } from "@/lib/utils";
import { imageFileValidation } from "@/validations/index.validation";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

type DropzoneProps = {
  onDrop?: (files: File[]) => void;
  className?: string;
  maxFiles?: number;
  multiple?: boolean;
  src?: string;
};

const allowedFileTypes = ACCEPTED_IMAGE_FILE_TYPE.map(
  type => `.${type.split("/")[1]}`,
);

function getFileSizeInMb(size: number) {
  return (size / (1024 * 1024)).toFixed(2);
}

type FileWithPreview = File & { preview: string };

export default function Dropzone({
  onDrop,
  className,
  maxFiles = 1,
  multiple = false,
  src,
}: DropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles,
    multiple,
    accept: {
      "image/*": allowedFileTypes,
    },
    onDrop: acceptedFiles => {
      const files = acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      ) as FileWithPreview[];
      setFiles(files);
      onDrop?.(files);
      setError(null);
    },
    onDragLeave: () => {
      setFiles([]);
      onDrop?.([]);
      setError(null);
    },
    onDropRejected: () => {
      setFiles([]);
      onDrop?.([]);
      setError("Invalid file type");
    },
    onError: error => {
      console.error(error);
      setError(error.message);
      onDrop?.([]);
    },
    validator: file => {
      const { success, error } = imageFileValidation.safeParse(file);
      if (!success) {
        throw new Error(error.errors[0].message);
      }
      return null;
    },
  });

  return (
    <div
      className={cn(
        "w-full border border-dashed hover:cursor-pointer h-fit dark:border-zinc-700 border-zinc-300 rounded-xl",
        className,
      )}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "20px",
          minHeight: "200px",
          position: "relative",
        }}
        {...getRootProps({ className: "dropzone" })}
      >
        <input {...getInputProps()} />
        <div className="w-full h-full absolute top-0 left-0 inset-0">
          <div className="w-full h-full flex gap-1 flex-col items-center justify-center">
            {!!src ? (
              <ImageItem
                src={src}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : !!acceptedFiles.length ? (
              <div className="w-full flex items-center gap-2 justify-center">
                {files.map(f => (
                  <ImageItem
                    key={f.size}
                    src={f.preview}
                    alt={f.name}
                    className="w-full h-full object-cover"
                  />
                ))}
              </div>
            ) : (
              <UploadIcon className="size-20 text-zinc-300 dark:text-zinc-600" />
            )}
            {!!acceptedFiles.length ? (
              <div className="w-full flex flex-col gap-2 items-center justify-center">
                {acceptedFiles.map(f => (
                  <span
                    key={f.size + Math.random() * 2000}
                    className="text-xs md:text-sm"
                  >
                    name: {f.name}, size: {getFileSizeInMb(f.size)} Mb
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-base md:text-lg font-medium">
                Drag your file here, or{" "}
                <span className="text-blue-500">Browse</span>
              </p>
            )}
            <span className="text-xs md:text-sm text-muted-foreground">
              Only {allowedFileTypes.join(", ")} files are allowed
            </span>
            {!!error && <span className="text-red-500 text-sm">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageItem({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className="w-[100px] border dark:border-zinc-600 border-zinc-400 h-[100px] rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        className={cn("object-cover w-full h-full", className)}
      />
    </div>
  );
}
