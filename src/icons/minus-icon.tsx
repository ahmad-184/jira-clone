import { cn } from "@/lib/utils";

export function MinusIcon({ className }: { className?: string }) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={"none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={cn("w-5", className)}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    </div>
  );
}

export function MinusIconFill({
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
        fill={fill ? fill : "currentColor"}
        className={cn("w-5", className)}
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
