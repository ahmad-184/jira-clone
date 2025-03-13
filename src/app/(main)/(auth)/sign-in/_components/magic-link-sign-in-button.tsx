"use client";

import { useState } from "react";
import Link from "next/link";
import { MailIcon } from "lucide-react";

import { LoaderButton } from "@/components/loader-button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function MagicLinkSignInButton({ className }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <Link href="/sign-in/magic-link" className="flex-1">
      <LoaderButton
        isLoading={loading}
        onClick={() => setLoading(true)}
        variant={"secondary"}
        className={cn("w-full", className)}
      >
        <div>
          <MailIcon />
        </div>
        Magic Link
      </LoaderButton>
    </Link>
  );
}
