import React from "react";
import { useCreateProject } from "./hooks/use-create-project";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";
import Dropzone from "@/components/dropzone";
import { Input } from "@/components/ui/input";

type Props = {
  workspaceId: string;
  setOpen?: (open: boolean) => void;
};

const CreateProjectForm = ({ workspaceId, setOpen }: Props) => {
  const {
    form,
    loading,
    error,
    onSubmit,
    handleChangeImageFile,
    imageFile,
    isUploading,
    disabled,
  } = useCreateProject({
    workspaceId,
    onClose: () => {
      setOpen?.(false);
    },
  });

  const imageUrl = form.watch("imageUrl");

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Enter project name"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex flex-col">
          <Dropzone
            files={imageFile ? [imageFile] : []}
            onDrop={file => handleChangeImageFile(file[0] ?? null)}
            src={imageUrl ?? imageFile?.preview ?? null}
            className="dark:!bg-gray-900/40 bg-gray-50"
          />
          <FormDescription className="mt-1">
            Project image is optional.
          </FormDescription>
        </div>
        {!!error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="h-1" />
        <div className="w-full">
          <LoaderButton
            className="w-full"
            disabled={disabled}
            isLoading={loading || isUploading}
            type="submit"
            variant="default"
          >
            {isUploading
              ? "Uploading..."
              : loading
                ? "Creating..."
                : "Create project"}
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
};

export default CreateProjectForm;
