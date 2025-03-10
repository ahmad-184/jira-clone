import Avatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkspaceMembersQuery } from "@/hooks/queries/use-get-workspace-memebrs";
import { useWorkspace } from "@/hooks/workspace-provider";
import { SettingIcon } from "@/icons/setting-icon";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardMembers() {
  const { workspaceId } = useWorkspace();
  const { data, isPending } = useGetWorkspaceMembersQuery(workspaceId);

  if (isPending) return <Skeleton className="w-full h-[300px]" />;

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full gap-5 justify-between items-center mb-3">
          <CardTitle className="text-muted-foreground font-medium">
            People ({data.length})
          </CardTitle>
          <div>
            <Link href={`/dashboard/${workspaceId}/members`}>
              <Button variant={"secondary"} size="icon">
                <SettingIcon />
              </Button>
            </Link>
          </div>
        </div>
        <DottedSeparator />
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {data.map(member => (
          <div key={member.id} className="flex items-center flex-1 gap-2">
            <div>
              <Avatar
                alt={`${member.user.profile.displayName} avatar`}
                profile={member.user.profile}
                className="w-20 h-20 border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p
                className={cn(
                  "text-xs font-medium text-muted-foreground capitalize",
                  {
                    "text-yellow-600 dark:text-yellow-500":
                      member.role === "OWNER",
                    "text-purple-600 dark:text-purple-500":
                      member.role === "ADMIN",
                    "text-blue-500 dark:text-blue-400":
                      member.role === "MEMBER",
                  },
                )}
              >
                {member.role === "OWNER"
                  ? "Creator"
                  : member.role.toLowerCase()}
              </p>
              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  {member.user.profile.displayName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
