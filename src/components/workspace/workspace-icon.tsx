import Image from "next/image";

import { Workspace } from "@/db/schema";
import { cn } from "@/lib/utils";

type Props = {
  workspace: Pick<Workspace, "imageUrl" | "name">;
  className?: string;
};

export default function WorkspaceIcon({ workspace, className }: Props) {
  if (workspace.imageUrl)
    return (
      <div
        className={cn("w-9 h-9 relative rounded-md overflow-hidden", className)}
      >
        <Image
          alt={workspace.name}
          src={workspace.imageUrl}
          fill
          className="object-cover"
        />
      </div>
    );

  return (
    <div
      className={cn(
        "w-9 h-9 rounded-md bg-gradient-to-t from-blue-500 to-blue-400 overflow-hidden flex items-center justify-center",
        className,
      )}
    >
      <p className="text-sm uppercase font-semibold dark:text-black">
        {workspace.name?.charAt(0)}
      </p>
    </div>
  );
}
