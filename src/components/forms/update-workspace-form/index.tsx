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
import { Member, Workspace } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Undo2Icon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {
  workspace: Workspace;
  currentMember: Member;
};

export default function UpdateWorkspaceForm({
  workspace,
  currentMember,
}: Props) {
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
    error,
    havePermission,
  } = useUpdateWorkspace({
    workspace,
    currentMember,
  });

  const [animated] = useAutoAnimate();

  return (
    <Form {...form}>
      <form ref={animated} onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          disabled={!havePermission}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Enter workspace name"
                  type="text"
                  {...(!havePermission && { readOnly: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={!havePermission}
          name="imageUrl"
          render={() => (
            <FormItem>
              <FormControl>
                <Dropzone
                  disabled={!havePermission}
                  onDrop={file => {
                    handleChangeImageFile(file.length ? file[0] : null);
                  }}
                  onRemove={() => {
                    handleChangeImageFile(null);
                    form.setValue("imageUrl", null);
                  }}
                  files={imageFile ? [imageFile] : []}
                  src={imageUrl ?? imageFile?.preview ?? null}
                  className="!bg-shark-50 dark:!bg-shark-900/60"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-1" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="w-full flex justify-end">
          <Button
            variant="secondary"
            type="button"
            className="mr-4"
            onClick={handleUndoChanges}
            disabled={!havePermission || disabled}
            size={"sm"}
          >
            <Undo2Icon className="w-4 h-4" /> Undo
          </Button>
          <LoaderButton
            isLoading={loading || isUploading}
            disabled={!havePermission || disabled}
            type="submit"
            variant="default"
            size={"sm"}
          >
            {isUploading ? "Uploading..." : "Update"}
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
