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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDeleteProject } from "./hooks/use-delete-project";

type Props = {
  projectName: string;
  projectId: string;
};

export default function DeleteProjectForm({ projectName, projectId }: Props) {
  const { form, onSubmit, error, loading } = useDeleteProject({
    projectName,
    projectId,
  });

  const [animated] = useAutoAnimate();

  return (
    <Form {...form}>
      <form ref={animated} className="flex flex-col gap-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">
                Type{" "}
                <span className="dark:text-shark-300 text-shark-700">
                  {projectName}
                </span>{" "}
                to confirm.
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Type the workspace name here"
                  className="bg-shark-50"
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
          I understand, delete this project.
        </LoaderButton>
      </form>
    </Form>
  );
}
