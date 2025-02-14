"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const DottedSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  {
    className?: string;
    color?: string;
    height?: string;
    dotSize?: string;
    gapSize?: string;
    direction?: "horizontal" | "vertical";
  }
>(
  (
    {
      className,
      color = "#454f59",
      direction = "horizontal",
      dotSize = "2px",
      gapSize = "6px",
      height = "2px",
      ...props
    },
    ref,
  ) => {
    const isHorizontal = direction === "horizontal";
    return (
      <div
        className={cn(
          isHorizontal
            ? "w-full flex items-center"
            : "h-full flex flex-col items-center",
          className,
        )}
      >
        <div
          ref={ref}
          className={cn(isHorizontal ? "flex-grow" : "flex-grow-0")}
          style={{
            width: isHorizontal ? "100%" : height,
            height: isHorizontal ? height : "100%",
            backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
            backgroundSize: isHorizontal
              ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
              : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
            backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
            backgroundPosition: "center",
          }}
          {...props}
        />
      </div>
    );
  },
);
DottedSeparator.displayName = SeparatorPrimitive.Root.displayName;

export { DottedSeparator };
