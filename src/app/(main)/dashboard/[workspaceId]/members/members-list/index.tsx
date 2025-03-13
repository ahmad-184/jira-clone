"use client";

import { Fragment } from "react";

import { useGetCurrentMemberQuery } from "@/hooks/queries/use-get-current-member";
import { useGetWorkspaceMembersQuery } from "@/hooks/queries/use-get-workspace-memebrs";
import Member from "./member";
import { useCurrentUserQuery } from "@/hooks/queries/use-current-user-query";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/hooks/workspace-provider";
import { Skeleton } from "@/components/ui/skeleton";

const getValidTimestamp = (date: string | Date | number): number => {
  const parsedDate = new Date(date).getTime();
  return isNaN(parsedDate) ? 0 : parsedDate; // Fallback to 0 if invalid
};

export default function MembersList() {
  const { workspaceId } = useWorkspace();

  const { data: members, isPending } = useGetWorkspaceMembersQuery(workspaceId);
  const { data: currentMember } = useGetCurrentMemberQuery(workspaceId);
  const { data: currentUser } = useCurrentUserQuery();

  if (isPending) return <LoadingSkeleton />;

  if (!currentMember?.id) return null;

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-6xl">
      <div className="w-full flex flex-col gap-2">
        {members
          ?.sort(
            (a, b) =>
              getValidTimestamp(a.createdAt) - getValidTimestamp(b.createdAt),
          )
          ?.map((member, i) => (
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

function LoadingSkeleton() {
  const skeletons = ["skeleton-1", "skeleton-2", "skeleton-3"];

  return (
    <div className="w-full max-w-6xl">
      <div className="w-full flex flex-col gap-2">
        {skeletons.map((skeleton, i) => (
          <Fragment key={skeleton}>
            <SingleSkeleton />
            {i !== skeletons.length - 1 && <Separator className="w-full" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function SingleSkeleton() {
  return (
    <div className={"w-full flex items-center gap-5 justify-between py-2"}>
      <div className="flex items-center flex-1 gap-2">
        <div>
          <Skeleton className="w-28 h-28 border rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-11 h-3" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
