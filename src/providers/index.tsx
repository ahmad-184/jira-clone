"use client";

import ReactQueryProvider from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
