"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserQuery } from "@/hooks/queries/use-current-user-query";
import Logo from "@/icons/logo";
import Link from "next/link";

const navLinks = [
  {
    href: "#features",
    text: "Features",
  },
  {
    href: "#pricing",
    text: "Pricing",
  },
  {
    href: "#about",
    text: "About",
  },
];

export default function Navbar() {
  const { data: user, isPending, isFetched } = useCurrentUserQuery();

  return (
    <div className="flex items-center justify-between">
      <Logo />
      <nav className="hidden space-x-6 text-sm dark:text-shark-200 md:block">
        {navLinks.map((e, i) => (
          <Link
            key={`${e.href}-${i}`}
            href={e.href}
            className="hover:border-b-2 border-shark-950 dark:hover:text-blue-300 dark:border-blue-400"
          >
            {e.text}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {!isFetched && !!isPending ? (
          <Skeleton className="w-16 h-10" />
        ) : !!isFetched ? (
          <Link href="/dashboard">
            <Button
              size={"default"}
              variant={"outline"}
              className="font-semibold border border-shark-700"
            >
              {user?.id ? "Dashboard" : "Login"}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
