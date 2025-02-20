import { cn } from "@/lib/utils";

export function ViewColumnsIcon({ className }: { className?: string }) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-5", className)}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    </div>
  );
}

export function ViewColumnsIconFill({
  className,
  fill,
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={fill || "currentColor"}
        className={cn("w-5", className)}
      >
        <path d="M15 3.75H9v16.5h6V3.75ZM16.5 20.25h3.375c1.035 0 1.875-.84 1.875-1.875V5.625c0-1.036-.84-1.875-1.875-1.875H16.5v16.5ZM4.125 3.75H7.5v16.5H4.125a1.875 1.875 0 0 1-1.875-1.875V5.625c0-1.036.84-1.875 1.875-1.875Z" />
      </svg>
    </div>
  );
}
