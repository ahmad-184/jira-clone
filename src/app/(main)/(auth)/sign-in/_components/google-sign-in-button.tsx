"use client";

import { LoaderButton } from "@/components/loader-button";
import GoogleIcon from "@/icons/google-icon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

type Props = {
  className?: string;
};

export default function GoogleSignInButton({ className }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <Link href="/api/login/google" className="flex-1">
      <LoaderButton
        isLoading={loading}
        onClick={() => setLoading(true)}
        variant={"secondary"}
        className={cn("w-full", className)}
      >
        <GoogleIcon className="w-4 h-4" />
        Google
      </LoaderButton>
    </Link>
  );
}
