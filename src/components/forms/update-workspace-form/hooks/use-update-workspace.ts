"use client";

import _isEqual from "lodash/isEqual";
import { updateWorkspaceSchema } from "@/validations/workspace.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateWorkspaceMutation } from "./mutations/use-update-workspace-mutations";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { startUploadImage } from "@/lib/uploader";
import { useQueryClient } from "@tanstack/react-query";
import { Workspace } from "@/db/schema";
import { FileWithPreview } from "@/types";

type Props = {
  workspace: Workspace;
};

export const useUpdateWorkspace = ({ workspace }: Props) => {
  const [imageFile, setImageFile] = useState<FileWithPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isStateChanged, setIsStateChanged] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      imageUrl: workspace.imageUrl,
    },
  });

  const handleChangeImageFile = (file: FileWithPreview | null) => {
    setImageFile(file);
  };

  useEffect(() => {
    form.reset({
      name: workspace.name,
      imageUrl: workspace.imageUrl,
    });
    setIsStateChanged(false);
    handleChangeImageFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  const { mutate, isPending } = useUpdateWorkspaceMutation({
    onSuccess: async () => {
      setIsStateChanged(false);
      handleChangeImageFile(null);
      await queryClient.invalidateQueries({
        queryKey: ["workspace", workspace.id],
      });
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Successfully updated.");
    },
    onError: err => {
      toast.error(err.message);
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    console.log(values);
    if (!workspace) return;
    let imageUrl = values.imageUrl ?? null;
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
      param: { id: workspace.id },
    });
  });

  const handleUndoChanges = () => {
    // if state is not changed and image file is present, remove image file
    if (!isStateChanged && imageFile) return handleChangeImageFile(null);
    // if state is not changed and image file is not present, reset state to original data
    if (!workspace || !isStateChanged) return;
    form.reset({
      name: workspace.name,
      imageUrl: workspace.imageUrl,
    });
    setIsStateChanged(false);
  };

  // watch form values and set isStateChanged to true if values are changed
  const watchFormValues = form.watch(values => {
    const isEq = _isEqual(
      JSON.stringify({
        name: workspace?.name,
        imageUrl: workspace?.imageUrl,
      }),
      JSON.stringify(values),
    );
    if (!isEq) setIsStateChanged(true);
    else setIsStateChanged(false);
  });

  // unsubscribe from form values when component unmounts
  useEffect(() => {
    return () => {
      watchFormValues.unsubscribe();
    };
  }, [watchFormValues]);

  // disable button if pending, uploading.
  // or do not disable if image file is present
  // or do not disable if state is not changed
  const disabled = useMemo(() => {
    if (isPending || isUploading) return true;
    if (imageFile) return false;
    return !isStateChanged;
  }, [imageFile, isStateChanged, isPending, isUploading]);

  const imageUrl = form.watch("imageUrl");

  return {
    form,
    onSubmit,
    loading: isPending,
    handleChangeImageFile,
    imageFile,
    imageUrl,
    isUploading,
    disabled,
    handleUndoChanges,
  };
};
