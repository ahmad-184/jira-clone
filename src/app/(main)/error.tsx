"use client";

import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AUTHENTICATION_ERROR_MESSAGE } from "@/lib/errors";

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
        <div className="w-full flex items-center justify-center h-full flex-col gap-1 flex-1">
          <div className="mb-2">
            <TriangleAlertIcon
              className="size-8 text-red-500"
              strokeWidth={1.3}
            />
          </div>
          <h1 className="text-lg text-red-500">
            Oops! You Need to Be Logged In
          </h1>
          <p className="text-sm text-center dark:text-shark-300 text-shark-700">
            To access this page, please log in first.
          </p>
          <Link href="/sign-in">
            <Button size={"sm"} variant={"default"}>
              Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center h-full flex-col gap-1 flex-1">
          <div className="mb-2">
            <TriangleAlertIcon
              className="size-8 text-red-500"
              strokeWidth={1.3}
            />
          </div>
          <h1 className="text-lg text-red-500">Oops! Something went wrong</h1>
          <p className="text-sm text-center dark:text-shark-300 text-shark-700">
            Try reload th page to resolve the error, If the error resist, <br />
            please call our support team.
          </p>
          <div className="mt-2 flex justify-center items-center gap-2">
            <Button
              size={"sm"}
              onClick={() => window.location.reload()}
              variant={"outline"}
            >
              Reload page
            </Button>
            <Link href={"/"}>
              <Button size={"sm"} variant={"secondary"}>
                Home
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
