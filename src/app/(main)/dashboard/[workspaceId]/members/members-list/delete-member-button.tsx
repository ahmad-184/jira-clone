import { Button } from "@/components/ui/button";
import { MinusIcon } from "@/icons/minus-icon";
import { useDeleteMember } from "./hooks/use-delete-member";
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
import { MemberWithUserEmailAndProfileType } from "@/types/members";
import { User } from "@/db/schema";

type Props = {
  member: MemberWithUserEmailAndProfileType;
  user: User;
};

export default function DeleteMemberButton({ member, user }: Props) {
  const { error, loading, onSubmit } = useDeleteMember({
    memberId: member.id,
    memberUserId: member.userId,
    currentUserId: user.id,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"destructive"}
          className="w-fit gap-1 px-2 py-1 h-fit"
          size="sm"
        >
          <MinusIcon />{" "}
          {member.userId === user.id
            ? `Leave Workspace`
            : `Remove ${member.user.profile.displayName}`}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            {member.userId === user.id
              ? "Are you sure you want to leave this workspace?"
              : "Are you sure you want to remove this member from the workspace?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!!error && (
          <div>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={loading}
            variant={"destructive"}
            onClick={onSubmit}
          >
            {member.userId === user.id ? "Yes, Leave" : "Yes, Remove"}
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
