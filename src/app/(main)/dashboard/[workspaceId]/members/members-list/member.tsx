"use client";

import Avatar from "@/components/avatar";
import { Member as MemberType, User } from "@/db/schema";
import { usePermission } from "@/hooks/use-permission";
import { fDate } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { MemberWithUserEmailAndProfileType } from "@/types/members";
import DeleteMemberButton from "./delete-member-button";
import UpdateMemberRoleButton from "./update-member-role-button";

type Props = {
  member: MemberWithUserEmailAndProfileType;
  currentMember: MemberType;
  user: User;
};

export default function Member({ member, currentMember, user }: Props) {
  const canRemoveMember = usePermission(
    currentMember.role,
    "members",
    "delete",
    {
      user,
      member,
    },
  );

  const canSetAsAdmin = usePermission(
    currentMember.role,
    "members",
    "update.role",
    {
      user,
      member,
    },
  );

  const canSetAsMember = usePermission(
    currentMember.role,
    "members",
    "update.role",
    {
      user,
      member,
    },
  );

  return (
    <div className={cn("w-full flex items-center gap-5 justify-between py-2")}>
      <div className="flex items-center flex-1 gap-2">
        <div>
          <Avatar
            alt={`${member.user.profile.displayName} avatar`}
            profile={member.user.profile}
            className="w-28 h-28 border"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p
            className={cn(
              "text-xs font-medium text-muted-foreground capitalize",
              {
                "text-yellow-600 dark:text-yellow-500": member.role === "OWNER",
                "text-purple-600 dark:text-purple-500": member.role === "ADMIN",
                "text-blue-500 dark:text-blue-400": member.role === "MEMBER",
              },
            )}
          >
            {member.role === "OWNER" ? "Prime" : member.role.toLowerCase()}
          </p>
          <div className="flex flex-col">
            <p className="text-sm font-medium">
              {member.user.profile.displayName}
            </p>
            <p className="text-sm text-muted-foreground">{member.user.email}</p>
          </div>
          <div className="flex gap-3 items-center mt-1 flex-wrap">
            {!!canSetAsAdmin.permission && member.role !== "ADMIN" && (
              <UpdateMemberRoleButton memberId={member.id} role="ADMIN" />
            )}
            {!!canSetAsMember.permission && member.role !== "MEMBER" && (
              <UpdateMemberRoleButton memberId={member.id} role="MEMBER" />
            )}
            {!!canRemoveMember.permission && (
              <DeleteMemberButton member={member} user={user} />
            )}
          </div>
        </div>
      </div>
      {member.role !== "OWNER" && (
        <div>
          <p className="text-xs text-muted-foreground">
            Joined at {fDate(member.createdAt)}
          </p>
        </div>
      )}
    </div>
  );
}
