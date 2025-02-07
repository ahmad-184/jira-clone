"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserQuery } from "@/hooks/queries/use-current-user-query";
import Logo from "@/icons/logo";
import Link from "next/link";

export default function Navbar() {
  const { data: user, isPending, isFetched } = useCurrentUserQuery();

  return (
    <div className="flex items-center justify-between">
      <Logo />
      <nav className="hidden space-x-6 text-sm dark:text-gray-200 md:block">
        <Link
          href="#features"
          className="hover:border-b-2 border-gray-950 dark:border-gray-100"
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="hover:border-b-2 border-gray-950 dark:border-gray-100"
        >
          Pricing
        </Link>
        <Link
          href="#about"
          className="hover:border-b-2 border-gray-950 dark:border-gray-100"
        >
          About
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        {!!isPending && <Skeleton className="w-16 h-10" />}
        {!!isFetched && (
          <Link href="/dashboard">
            <Button
              size={"default"}
              className="h-10 dark:bg-white dark:hover:bg-white dark:text-black font-semibold"
            >
              {user?.id ? "Dashboard" : "Login"}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
