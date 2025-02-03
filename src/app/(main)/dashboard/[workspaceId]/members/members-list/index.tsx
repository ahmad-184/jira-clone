"use client";

import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useGetWorkspaceMembersQuery } from "@/hooks/queries/use-get-workspace-memebrs";
import { Fragment } from "react";
import Member from "./member";
import { useCurrentUserQuery } from "@/hooks/queries/use-current-user-query";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/hooks/workspace-provider";

export default function MembersList() {
  const { workspaceId } = useWorkspace();

  const { data: members, isPending } = useGetWorkspaceMembersQuery(workspaceId);
  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);
  const { data: currentUser } = useCurrentUserQuery();

  if (isPending)
    return (
      <div>
        <p className="w-full max-w-2xl">loading...</p>
      </div>
    );

  if (!currentMember?.id) return null;

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-6xl">
      <div className="w-full flex flex-col gap-2">
        {members?.map((member, i) => (
          <Fragment key={member.id}>
            <Member
              member={member}
              currentMember={currentMember}
              user={currentUser}
            />
            {i !== members.length - 1 && <Separator className="w-full" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
