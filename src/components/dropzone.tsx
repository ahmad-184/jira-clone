import { ACCEPTED_IMAGE_FILE_TYPE } from "@/app-config";
import UploadIcon from "@/icons/upload-icon";
import { cn } from "@/lib/utils";
import { imageFileValidation } from "@/validations/index.validation";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";
import { FileWithPreview } from "@/types";

type DropzoneProps = {
  onDrop?: (files: FileWithPreview[]) => void;
  files: FileWithPreview[];
  className?: string;
  maxFiles?: number;
  multiple?: boolean;
  src?: string | null;
  onRemove?: () => void;
  disabled?: boolean;
};

const allowedFileTypes = ACCEPTED_IMAGE_FILE_TYPE.map(
  type => `.${type.split("/")[1]}`,
);

function getFileSizeInMb(size: number) {
  return (size / (1024 * 1024)).toFixed(2);
}

export default function Dropzone({
  onDrop,
  className,
  maxFiles = 1,
  multiple = false,
  src,
  onRemove,
  files = [],
  disabled = false,
}: DropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    multiple,
    disabled,
    accept: {
      "image/*": allowedFileTypes,
    },
    onDrop: acceptedFiles => {
      const files = acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      ) as FileWithPreview[];
      onDrop?.(files);
      setError(null);
    },
    onDragLeave: () => {
      onDrop?.([]);
      setError(null);
    },
    onDropRejected: () => {
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

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setError(null);
    onRemove?.();
  };

  const showRemoveButton = Boolean(!!files.length || !!src);
  const showUploadLogo = Boolean(!src && !files.length);
  const showFiles = Boolean(!src && !!files.length);
  const showImagePreview = Boolean(!!src);
  const filesExist = Boolean(!!files.length);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        display: "flex",
        height: "fit-content",
        flexGrow: 1,
      }}
      {...getRootProps({ className: "dropzone" })}
    >
      <div
        className={cn(
          "w-full border p-5 border-dashed h-fit hover:cursor-pointer dark:border-zinc-700 border-zinc-300 rounded-xl",
          className,
        )}
      >
        <input {...getInputProps()} />
        <div className="w-full h-full flex min-h-[200px] items-center justify-center">
          <div className="w-full py-5 h-full flex gap-1 flex-col items-center justify-center">
            {!!showImagePreview && (
              <ImageItem
                src={src ?? ""}
                alt="preview"
                className="w-full h-full object-cover"
              />
            )}
            {!!showFiles && (
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
            )}
            {showUploadLogo && (
              <UploadIcon className="size-20 text-zinc-300 dark:text-zinc-600" />
            )}
            {showRemoveButton && (
              <Button
                variant="outline"
                size={"sm"}
                className="text-xs mt-2"
                type="button"
                onClick={handleRemove}
              >
                <Trash2Icon className="w-4 h-4" /> Remove Images
              </Button>
            )}
            {!!filesExist ? (
              <div className="w-full flex flex-col gap-2 items-center justify-center">
                {files.map(f => (
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
