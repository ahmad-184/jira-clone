import { SignInStoreProvider } from "./store/sign-in-store";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SignInStoreProvider>{children}</SignInStoreProvider>;
}
