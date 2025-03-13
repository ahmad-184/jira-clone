"use client";

import { useState } from "react";
import Link from "next/link";

import { LoaderButton } from "@/components/loader-button";
import GithubIcon from "@/icons/github-icon";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function GithubSignInButton({ className }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <Link href="/api/login/github" className="flex-1">
      <LoaderButton
        isLoading={loading}
        onClick={() => setLoading(true)}
        variant={"secondary"}
        className={cn("w-full", className)}
      >
        <GithubIcon className="w-4 h-4" fill="white" />
        Github
      </LoaderButton>
    </Link>
  );
}
