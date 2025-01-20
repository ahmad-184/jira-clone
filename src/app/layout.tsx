import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import Providers from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { applicationName } from "@/app-config";
import TopLoader from "@/components/top-loader";

import "./globals.css";

const PlusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: applicationName,
  description:
    "Slide revolutionizes how you connect with your audience on Instagram. Automate responses and boost engagement effortlessly, turning interactions into valuable business opportunities.",
  icons: [
    { rel: "icon", type: "image/png", sizes: "48x48", url: "/icon?icon.tsx" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${PlusJakartaSans.className} antialiased`}>
        <Providers>
          {children}
          <Toaster />
          <TopLoader />
        </Providers>
      </body>
    </html>
  );
}
