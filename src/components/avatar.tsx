import { Profile } from "@/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Avatar({
  profile,
  alt,
  className,
}: {
  profile: Pick<Profile, "image" | "displayName">;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "size-10 relative overflow-hidden border rounded-full bg-gray-200 dark:bg-muted",
        className,
      )}
    >
      <Image
        className="w-full h-full object-cover"
        alt={alt}
        src={
          profile.image ??
          `https://avatar.iran.liara.run/username?username=${profile.displayName}`
        }
        fill
      />
    </div>
  );
}
