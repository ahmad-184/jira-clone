import { UserId } from "@/use-cases/types";
import { createWorkspaceSchema } from "@/validations/workspace.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateWorkspaceMutation } from "./mutations/use-create-workspace-mutations";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { startUploadImage } from "@/lib/uploader";
import { useQueryClient } from "@tanstack/react-query";
import { FileWithPreview } from "@/types";

type Props = {
  userId: UserId;
  isFirstWorkspace: boolean;
};

export const useCreateWorkspace = ({ userId, isFirstWorkspace }: Props) => {
  const [imageFile, setImageFile] = useState<FileWithPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      userId,
      name: "",
      imageUrl: "",
    },
  });

  const handleChangeImageFile = (file: FileWithPreview | null) => {
    setImageFile(file);
  };

  const { mutate, isPending } = useCreateWorkspaceMutation({
    onSuccess: async () => {
      toast.success("Workspace created successfully");
      if (isFirstWorkspace) {
        setTimeout(() => (window.location.href = "/dashboard"), 2000);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      }
      form.reset({ userId });
    },
    onError: err => {
      toast.error(err.message);
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    let imageUrl = null;
    try {
      if (imageFile) {
        const file = await startUploadImage({
          files: [imageFile],
          setIsUploading,
        });
        if (file) imageUrl = file[0].file.secure_url;
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to save image.");
    }
    mutate({
      json: { ...values, imageUrl },
    });
  });

  const disabled = useMemo(() => {
    if (isPending || isUploading) return true;
    return !form.formState.isDirty;
  }, [isPending, isUploading, form.formState.isDirty]);

  return {
    form,
    onSubmit,
    loading: isPending,
    handleChangeImageFile,
    imageFile,
    isUploading,
    disabled,
  };
};
