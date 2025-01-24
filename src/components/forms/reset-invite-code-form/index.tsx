import { useResetInviteLink } from "./hooks/use-reset-invite-link";
import { Form } from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";

type Props = {
  workspaceId: string;
  setOpen: (open: boolean) => void;
};

export default function ResetInviteCodeForm({ workspaceId, setOpen }: Props) {
  const { form, onSubmit, error, loading } = useResetInviteLink(
    workspaceId,
    () => setOpen(false),
  );

  return (
    <Form {...form}>
      {!!error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <LoaderButton variant="destructive" isLoading={loading} type="submit">
          I understand, reset my invite code
        </LoaderButton>
      </form>
    </Form>
  );
}
