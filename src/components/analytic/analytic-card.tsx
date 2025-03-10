import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  title: string;
  value: number;
  variant: "UP" | "DOWN";
  difference: number;
  color: "GREEN" | "RED";
};

export default function AnalyticCard({
  title,
  value,
  variant,
  difference,
  color,
}: Props) {
  const url = `/sort-${variant === "UP" ? "up" : "down"}-${color === "GREEN" ? "green" : "red"}.png`;
  return (
    <Card className="shadow-none border-none w-full h-[150px] min-w-[200px]">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-sm">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1.5">
            <div>
              <Image
                src={url}
                alt={`${variant} ${color}`}
                width={14}
                height={14}
              />
            </div>
            <span
              className={cn(
                color === "GREEN" ? "text-green-500" : "text-red-500",
                "truncate text-sm font-medium",
              )}
            >
              {difference}
            </span>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
