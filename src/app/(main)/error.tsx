"use client";

import { Button } from "@/components/ui/button";
import { AUTHENTICATION_ERROR_MESSAGE } from "@/lib/errors";
import Link from "next/link";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const isAuthenticationError = error.message.includes(
    AUTHENTICATION_ERROR_MESSAGE,
  );

  return (
    <div className="container mx-auto py-12 min-h-screen space-y-8">
      {isAuthenticationError ? (
        <>
          <h1 className="text-3xl">Oops! You Need to Be Logged In</h1>
          <p className="text-lg">To access this page, please log in first.</p>

          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-3xl">Oops! Something went wrong</h1>
          <p className="text-lg">{error.message}</p>
        </>
      )}
    </div>
  );
}
