import { ReactNode } from "react";

export default async function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="w-full">{children}</div>;
}
