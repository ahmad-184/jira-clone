"use client";

import { useTheme } from "next-themes";

export default function Logo() {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-1 select-none"
      style={{
        gap: "3px",
      }}
    >
      <div
        style={{
          backgroundColor: resolvedTheme === "dark" ? "white" : "black",
          color: resolvedTheme === "dark" ? "black" : "white",
        }}
        className="h-8 w-10 rounded-lg dark:bg-white dark:text-black text-white bg-black flex items-center justify-center font-bold"
      >
        Task
      </div>
      <span className="text-xl font-semibold">Hive</span>
    </div>
  );
}
