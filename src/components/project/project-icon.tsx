import Image from "next/image";

import { Project } from "@/db/schema";
import { cn } from "@/lib/utils";

type Props = {
  project: Pick<Project, "imageUrl" | "name">;
  className?: string;
};

export default function ProjectIcon({ project, className }: Props) {
  if (project.imageUrl)
    return (
      <div
        className={cn(
          "w-5 h-5 relative rounded-md overflow-hidden select-none",
          className,
        )}
      >
        <Image
          alt={project.name}
          src={project.imageUrl}
          fill
          className="object-cover"
        />
      </div>
    );

  return (
    <div
      className={cn(
        "w-5 h-5 text-sm rounded-md bg-gradient-to-t from-purple-500 to-purple-400 overflow-hidden flex items-center justify-center select-none",
        className,
      )}
    >
      <p className="uppercase font-semibold text-black">
        {project.name?.charAt(0)}
      </p>
    </div>
  );
}
