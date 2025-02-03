import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoaderButton } from "@/components/loader-button";
import { Role } from "@/db/schema";
import { UsersIconFill } from "@/icons/users-icon";
import { useUpdateMemberRole } from "./hooks/use-update-member-role";

type Props = {
  memberId: string;
  role: Exclude<Role, "OWNER">;
};

export default function UpdateMemberRoleButton({ memberId, role }: Props) {
  const { error, loading, onSubmit } = useUpdateMemberRole({
    memberId: memberId,
    role,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"default"}
          className="w-fit gap-1 px-2 py-1 h-fit"
          size="sm"
        >
          <UsersIconFill />
          Set as <span className="capitalize">{role.toLowerCase()}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Member Role</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to update this member&apos;s role?
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!!error && (
          <div>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton isLoading={loading} onClick={onSubmit}>
            Yes, Update
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
