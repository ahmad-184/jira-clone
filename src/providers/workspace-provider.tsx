"use client";

import { createContext } from "react";

type ContextType = {
  workspaceId: string;
};

export const WorkspaceContext = createContext<ContextType>({
  workspaceId: "",
});

type ProviderProps = {
  children: React.ReactNode;
  workspaceId: string;
};

export const WorkspaceProvider = ({ children, workspaceId }: ProviderProps) => {
  return (
    <WorkspaceContext.Provider value={{ workspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
