import { Form } from "@/components/ui/form";
import { useDeleteTask } from "./hooks/use-delete-task";
import { LoaderButton } from "@/components/loader-button";

type Props = {
  taskIds: string[];
  onCallback?: () => void;
};

export default function DeleteTaskForm({ taskIds, onCallback }: Props) {
  const { form, loading, onSubmit } = useDeleteTask({
    taskIds,
    onCallback,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex-1">
        <LoaderButton
          className="w-full"
          variant={"destructive"}
          onClick={onSubmit}
          isLoading={loading}
        >
          Delete
        </LoaderButton>
      </form>
    </Form>
  );
}
