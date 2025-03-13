"use client";

import { useEffect, useMemo, useState } from "react";
import _isEqual from "lodash/isEqual";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { startUploadImage } from "@/lib/uploader";
import { Member, Project } from "@/db/schema";
import { FileWithPreview } from "@/types";
import { usePermission } from "@/hooks/use-permission";
import { updateProjectSchema } from "@/validations/project.validation";
import { useUpdateProjectMutation } from "./mutations/use-update-project-mutation";

type Props = {
  project: Project;
  currentMember: Member;
};

export const useUpdateProject = ({ project, currentMember }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<FileWithPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isStateChanged, setIsStateChanged] = useState(false);

  const canUpdateProject = usePermission(
    currentMember.role,
    "projects",
    "update",
    undefined,
  );

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      imageUrl: project.imageUrl,
    },
  });

  const handleChangeImageFile = (file: FileWithPreview | null) => {
    setImageFile(file);
  };

  useEffect(() => {
    form.reset({
      name: project.name,
      imageUrl: project.imageUrl,
    });
    setIsStateChanged(false);
    handleChangeImageFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const { mutate, isPending } = useUpdateProjectMutation({
    onSuccess: async () => {
      setIsStateChanged(false);
      handleChangeImageFile(null);
      toast.success("Successfully updated.");
    },
    onError: err => {
      setError(err.message);
    },
    onMutate: () => {
      setError(null);
    },
  });

  const onSubmit = form.handleSubmit(async values => {
    if (!project) return;
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
      param: { id: project.id },
    });
  });

  const handleUndoChanges = () => {
    // if state is not changed and image file is present, remove image file
    if (!isStateChanged && imageFile) return handleChangeImageFile(null);
    // if state is not changed and image file is not present, reset state to original data
    if (!project || !isStateChanged) return;
    form.reset({
      name: project.name,
      imageUrl: project.imageUrl,
    });
    setIsStateChanged(false);
  };

  // watch form values and set isStateChanged to true if values are changed
  const watchFormValues = form.watch(values => {
    const isEq = _isEqual(
      JSON.stringify({
        name: project?.name,
        imageUrl: project?.imageUrl,
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
    error,
    havePermission: canUpdateProject.permission,
  };
};
