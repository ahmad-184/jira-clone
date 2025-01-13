"use client";

import { createContext, useContext, useRef } from "react";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

type RegisterState = {
  userId: number | null;
  email: string;
  otp: string;
  step: "register" | "verify";
};

type RegisterAction = {
  setUserId: (userId: number) => void;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  setStep: (step: "register" | "verify") => void;
};

const defaultInitState: RegisterState = {
  userId: null,
  email: "",
  otp: "",
  step: "register",
};

type RegisterStore = RegisterState & RegisterAction;

const createRegisterStore = (initState: RegisterState = defaultInitState) => {
  return create<RegisterStore>()(
    immer(set => ({
      ...initState,
      setUserId: userId =>
        set(state => {
          state.userId = userId;
        }),
      setEmail: email =>
        set(state => {
          state.email = email;
        }),
      setOtp: otp =>
        set(state => {
          state.otp = otp;
        }),
      setStep: step =>
        set(state => {
          state.step = step;
        }),
    })),
  );
};

type RegisterStoreApi = ReturnType<typeof createRegisterStore>;

const RegisterStoreContext = createContext<RegisterStoreApi | undefined>(
  undefined,
);

interface RegisterStoreProviderProps {
  children: React.ReactNode;
}

export const RegisterStoreProvider = ({
  children,
}: RegisterStoreProviderProps) => {
  const storeRef = useRef<RegisterStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createRegisterStore();
  }

  return (
    <RegisterStoreContext.Provider value={storeRef.current}>
      {children}
    </RegisterStoreContext.Provider>
  );
};

export const useRegisterStore = <T,>(
  selector: (store: RegisterStore) => T,
): T => {
  const registerStoreContext = useContext(RegisterStoreContext);

  if (!registerStoreContext) {
    throw new Error(
      `useRegisterStore must be used within RegisterStoreProvider`,
    );
  }

  return useStore(registerStoreContext, selector);
};
