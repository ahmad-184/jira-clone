"use client";

import ReactQueryProvider from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
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
  );
};

export default Providers;
