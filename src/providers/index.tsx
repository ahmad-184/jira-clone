"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import ReactQueryProvider from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <NuqsAdapter>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark"]}
          // enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ReactQueryProvider>
    </NuqsAdapter>
  );
};

export default Providers;
