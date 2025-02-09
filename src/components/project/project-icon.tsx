import { Project } from "@/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  project: Pick<Project, "imageUrl" | "name">;
  className?: string;
};

export default function ProjectIcon({ project, className }: Props) {
  if (project.imageUrl)
    return (
      <div
        className={cn("w-5 h-5 relative rounded-sm overflow-hidden", className)}
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
        "w-5 h-5 text-sm rounded-sm bg-purple-500 overflow-hidden flex items-center justify-center",
        className,
      )}
    >
      <p className="uppercase font-semibold text-black">
        {project.name?.charAt(0)}
      </p>
    </div>
  );
}
