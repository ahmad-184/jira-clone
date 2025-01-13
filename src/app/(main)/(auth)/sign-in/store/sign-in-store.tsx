"use client";

import { createContext, useContext, useRef } from "react";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

type SignInState = {
  email: string;
};

type SignInAction = {
  setEmail: (email: string) => void;
};

const defaultInitState: SignInState = {
  email: "",
};

type SignInStore = SignInState & SignInAction;

const createSignInStore = (initState: SignInState = defaultInitState) => {
  return create<SignInStore>()(
    immer(set => ({
      ...initState,
      setEmail: email =>
        set(state => {
          state.email = email;
        }),
    })),
  );
};

type SignInStoreApi = ReturnType<typeof createSignInStore>;

const SignInStoreContext = createContext<SignInStoreApi | undefined>(undefined);

interface SignInStoreProviderProps {
  children: React.ReactNode;
}

export const SignInStoreProvider = ({ children }: SignInStoreProviderProps) => {
  const storeRef = useRef<SignInStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createSignInStore();
  }

  return (
    <SignInStoreContext.Provider value={storeRef.current}>
      {children}
    </SignInStoreContext.Provider>
  );
};

export const useSignInStore = <T,>(selector: (store: SignInStore) => T): T => {
  const signInStoreContext = useContext(SignInStoreContext);

  if (!signInStoreContext) {
    throw new Error(`useSignInStore must be used within SignInStoreProvider`);
  }

  return useStore(signInStoreContext, selector);
};
