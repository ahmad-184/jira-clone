import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDeleteWorkspace } from "./hooks/use-delete-workspace";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/loader-button";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {
  workspaceName: string;
  workspaceId: string;
};

export default function DeleteWorkspaceForm({
  workspaceName,
  workspaceId,
}: Props) {
  const { form, onSubmit, error, loading } = useDeleteWorkspace({
    workspaceName,
    workspaceId,
  });

  const [animated] = useAutoAnimate();

  return (
    <Form {...form}>
      <form ref={animated} className="flex flex-col gap-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="workspaceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">
                Type{" "}
                <span className="dark:text-shark-300 text-shark-700">
                  {workspaceName}
                </span>{" "}
                to confirm.
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Type the workspace name here"
                  className="dark:bg-shark-950 bg-shark-50"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!!error && <p className="text-red-500 text-sm">{error}</p>}

        <LoaderButton
          isLoading={loading}
          type="submit"
          className="w-full"
          variant={"destructive"}
        >
          I understand, delete this workspace.
        </LoaderButton>
      </form>
    </Form>
  );
}
