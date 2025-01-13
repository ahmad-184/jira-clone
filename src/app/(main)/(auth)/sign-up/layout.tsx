import { RegisterStoreProvider } from "./store/register-store";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RegisterStoreProvider>{children}</RegisterStoreProvider>;
}
