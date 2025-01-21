"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/loader-button";
import Dropzone from "@/components/dropzone";
import { useUpdateWorkspace } from "./hooks/use-update-workspace";
import { Workspace } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Undo2Icon } from "lucide-react";

type Props = {
  workspace: Workspace;
};

export default function UpdateWorkspaceForm({ workspace }: Props) {
  const {
    form,
    onSubmit,
    loading,
    handleChangeImageFile,
    isUploading,
    handleUndoChanges,
    disabled,
    imageFile,
    imageUrl,
  } = useUpdateWorkspace({
    workspace,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full !bg-zinc-950/20"
                  placeholder="Enter workspace name"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={() => (
            <FormItem>
              <FormControl>
                <Dropzone
                  onDrop={file => {
                    handleChangeImageFile(file.length ? file[0] : null);
                  }}
                  onRemove={() => {
                    handleChangeImageFile(null);
                    form.setValue("imageUrl", null);
                  }}
                  files={imageFile ? [imageFile] : []}
                  src={imageUrl ?? imageFile?.preview ?? null}
                  className="!bg-zinc-950/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-1" />
        <div className="w-full flex justify-end">
          <Button
            variant="secondary"
            type="button"
            className="mr-4"
            onClick={handleUndoChanges}
            disabled={disabled}
          >
            <Undo2Icon className="w-4 h-4" /> Undo
          </Button>
          <LoaderButton
            isLoading={loading || isUploading}
            disabled={disabled}
            type="submit"
            variant="default"
          >
            {isUploading ? "Uploading..." : "Update"}
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
