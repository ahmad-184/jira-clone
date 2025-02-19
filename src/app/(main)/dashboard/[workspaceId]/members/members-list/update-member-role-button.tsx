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
import { useState } from "react";
import { DottedSeparator } from "@/components/ui/dotted-separator";

type Props = {
  memberId: string;
  role: Exclude<Role, "OWNER">;
};

export default function UpdateMemberRoleButton({ memberId, role }: Props) {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const { error, loading, onSubmit } = useUpdateMemberRole({
    memberId: memberId,
    role,
    onClose,
  });

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
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
            Are you sure you want to change this member&apos;s role?
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!!error && (
          <div>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        <DottedSeparator />
        <AlertDialogFooter>
          <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
          <LoaderButton
            className="flex-1"
            variant={"success"}
            isLoading={loading}
            onClick={onSubmit}
          >
            Yes, Do it
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
