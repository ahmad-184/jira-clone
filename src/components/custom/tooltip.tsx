import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CustomTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string | React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
