"use client";

import { Button } from "@/components/ui/button";
import { AUTHENTICATION_ERROR_MESSAGE } from "@/lib/errors";
import { TriangleAlertIcon } from "lucide-react";
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
    <div className="container mx-auto bg-rose-800/10 rounded-xl py-12 h-full flex-1 space-y-8">
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
          <p className="text-sm text-center dark:text-gray-300 text-gray-700">
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
          <p className="text-sm text-center dark:text-gray-300 text-gray-700">
            Try reload th page to resolve the error, If the error resist, <br />
            please call our support team.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-2"
            size={"sm"}
            variant={"outline"}
          >
            Reload page
          </Button>
        </div>
      )}
    </div>
  );
}
