import { UserId } from "@/use-cases/types";
import { useCreateWorkspace } from "./hooks/use-create-workspace";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/loader-button";
import Dropzone from "@/components/dropzone";

type Props = {
  userId: UserId;
  isFirstWorkspace: boolean;
};

export default function CreateWorkspaceForm({
  userId,
  isFirstWorkspace,
}: Props) {
  const { form, onSubmit, loading, setImageFile, isUploading } =
    useCreateWorkspace({
      userId,
      isFirstWorkspace,
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
                  className="w-full"
                  placeholder="Enter workspace name"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex flex-col">
          <Dropzone
            onDrop={file => setImageFile(file.length ? file[0] : null)}
          />
          <FormDescription className="mt-1">
            Workspace logo is optional.
          </FormDescription>
        </div>
        <div className="h-1" />
        <div className="w-full">
          <LoaderButton
            className="w-full"
            isLoading={loading || isUploading}
            type="submit"
            variant="default"
          >
            {isUploading ? "Uploading..." : "Create workspace"}
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
