import { useEffect, useMemo, useState } from "react";
import { useCreateProjectMutation } from "./mutations/use-create-project-mutation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createProjectSchema } from "@/validations/project.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileWithPreview } from "@/types";
import { startUploadImage } from "@/lib/uploader";

type Props = {
  workspaceId: string;
  onClose?: () => void;
};

export const useCreateProject = ({ workspaceId, onClose }: Props) => {
  const [imageFile, setImageFile] = useState<FileWithPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      imageUrl: null,
      workspaceId,
    },
  });

  const handleChangeImageFile = (file: FileWithPreview | null) => {
    setImageFile(file);
  };

  const { mutate, isPending } = useCreateProjectMutation({
    onSuccess: async () => {
      form.reset();
      toast.success("Project created successfully");
      await queryClient.invalidateQueries({
        queryKey: ["workspace-projects", workspaceId],
      });
      onClose?.();
    },
    onError: error => {
      setError(error.message);
    },
    onMutate: () => {
      setError(null);
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

  useEffect(() => {
    form.setValue("workspaceId", workspaceId);
  }, [workspaceId]);

  return {
    form,
    loading: isPending,
    error,
    onSubmit,
    handleChangeImageFile,
    isUploading,
    imageFile,
    disabled,
  };
};
