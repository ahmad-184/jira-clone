"use client";

// import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  // const { resolvedTheme } = useTheme();

  return (
    <NextTopLoader
      showSpinner={false}
      // color={resolvedTheme === "dark" ? "#f4f4f5" : "#09090b"}
      color={"#2563eb"}
    />
  );
}
